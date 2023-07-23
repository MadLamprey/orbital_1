import json
import datetime as dt
import time
from email.message import EmailMessage
import smtplib
import base64
import io
import matplotlib.pyplot as plt
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, date
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import re
import matplotlib
matplotlib.use('Agg')

app = Flask(__name__)
CORS(app)

API_BASE_URL = 'https://api.nusmods.com/v2/'

# Function to fetch module information


def fetch_module_info(module_code):
    url = f"{API_BASE_URL}2022-2023/modules/{module_code}.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return f"Failed to fetch module information for {module_code}"


# Function to calculate module workload
def calculate_module_workload(module):
    try:
        module_info = fetch_module_info(module)
        workload = module_info['workload']
        total_workload = 0.0
        for val in workload:
            total_workload += val
    except:
        return None
    return total_workload

# Function to fetch timetable data for a module


def fetch_timetable_data(module_code):
    url = f"{API_BASE_URL}2023-2024/modules/{module_code}.json"
    response = requests.get(url)
    if response.status_code == 200:
        res = response.json()
        return res['semesterData'][0]['timetable']
    else:
        return None


def get_timetable_data(modules):
    try:
        timetable_data = {}
        for module in modules:
            module_timetable_data = fetch_timetable_data(module['moduleCode'])
            timetable_data[module['moduleCode']] = {}
            for activity in module_timetable_data:
                lessonType = activity['lessonType']
                if lessonType not in timetable_data[module['moduleCode']]:
                    timetable_data[module['moduleCode']][lessonType] = []
            for lesson in timetable_data[module['moduleCode']]:
                class_no = ''
                for le in module['lessons']:
                    if le['lessonType'] == lesson:
                        class_no = le['classNumber']
                        break
                for activity in module_timetable_data:
                    cn = activity['classNo']
                    les = activity['lessonType']
                    if cn == class_no and les == lesson:
                        timetable_data[module['moduleCode']
                                       ][lesson].append(activity)
    except:
        return None
    return timetable_data


def get_days_data(timetable_data):
    days = {'Monday': {}, 'Tuesday': {},
            'Wednesday': {}, 'Thursday': {}, 'Friday': {}}
    for data in timetable_data:
        for data_1 in timetable_data[data]:
            for i in range(len(timetable_data[data][data_1])):
                day = timetable_data[data][data_1][i]['day']
                days[day][data] = []

    for data in timetable_data:
        for data_1 in timetable_data[data]:
            for i in range(len(timetable_data[data][data_1])):
                day = timetable_data[data][data_1][i]['day']
                days[day][data].append(timetable_data[data][data_1][i])
    return days


def get_study_data(days, total_hours):
    study = {}
    for day in days:
        study[day] = []
    for day in days:
        study_time = total_hours
        for mods in days[day]:
            for activity in days[day][mods]:
                start_time = datetime.strptime(
                    activity['startTime'], "%H%M").time()
                end_time = datetime.strptime(
                    activity['endTime'], "%H%M").time()
                duration = (datetime.combine(date.today(), end_time) -
                            datetime.combine(date.today(), start_time)).seconds / 3600
                study_time -= duration
        study[day].append(study_time)
    return study


def get_total_study_time(study):
    try:
        total_study_time = 0
        for day in study:
            total_study_time += study[day][0]
        return total_study_time
    except:
        return 0


def get_module_workload(modules):
    try:
        module_workload = {}
        for module in modules:
            workload = calculate_module_workload(module['moduleCode'])
            module_workload[module['moduleCode']] = workload
        return module_workload
    except:
        return {}


def get_study_slots(module_workload, total_study_time):
    total_workload = sum(module_workload.values())
    study_slots = {}
    for module, workload in module_workload.items():
        slots = int(round(total_study_time * (workload / total_workload)))
        study_slots[module] = slots
    return study_slots


def get_study_schedule(modules, study_slots):
    try:
        study_schedule = {'Monday': {}, 'Tuesday': {},
                          'Wednesday': {}, 'Thursday': {}, 'Friday': {}}
        for day in study_schedule:
            for module in modules:
                study_schedule[day][module['moduleCode']] = []
            for module in modules:
                study_schedule[day][module['moduleCode']].append(
                    study_slots[module['moduleCode']] // 5)
        return study_schedule
    except:
        return {'Monday': {}, 'Tuesday': {}, 'Wednesday': {}, 'Thursday': {}, 'Friday': {}}


def get_time_slots(starttime, total_hours):
    time_slots = []
    current_hour = int(starttime)
    for i in range(total_hours):
        next_hour = str((current_hour + 100) % 2400).zfill(4)
        time_slot = f"{str(current_hour).zfill(4)}-{next_hour}"
        time_slots.append(time_slot)
        current_hour = int(next_hour)
    return time_slots


def fetch_exam_dates(module_code):
    url = f"{API_BASE_URL}2023-2024/modules/{module_code}.json"
    response = requests.get(url)
    if response.status_code == 200:
        try:
            res = response.json()
            return res['semesterData'][0]['examDate']
        except:
            return 'No Exam'
    else:
        return None


def get_exam_dates(modules):
    exam_dates = {}
    for module in modules:
        exam_dates[module['moduleCode']] = []
    for module in modules:
        exam_dates[module['moduleCode']].append(
            fetch_exam_dates(module['moduleCode']))
    return exam_dates


def get_timetable_data_1(days, time_slots, total_hours):
    try:
        timetable = {'Monday': {}, 'Tuesday': {},
                     'Wednesday': {}, 'Thursday': {}, 'Friday': {}}
        for day in timetable:
            for i in range(total_hours):
                timetable[day][time_slots[i]] = []
        for day in days:
            for mod in days[day]:
                for activity in days[day][mod]:
                    start__time = activity['startTime']
                    end__time = activity['endTime']
                    duration = int(end__time) / 100 - int(start__time) / 100
                    if duration > 1:
                        while start__time != end__time:
                            new_end_time = ""
                            if (int(start__time) + 100) >= 1000:
                                new_end_time = str(int(start__time) + 100)
                            else:
                                new_end_time = "0" + \
                                    str(int(start__time) + 100)
                            timetable[day][f"{int(start__time)}-{new_end_time}"].append(
                                f"({mod}, {activity['lessonType']})")
                            start__time = new_end_time
                    else:
                        if (int(start__time) + 100) >= 1000:
                            new_end_time = str(int(start__time) + 100)
                        else:
                            new_end_time = "0" + str(int(start__time) + 100)
                        timetable[day][f"{start__time}-{new_end_time}"].append(
                            f"({mod}, {activity['lessonType']})")
                        start__time = new_end_time

        for day in timetable:
            for s in timetable[day]:
                if len(timetable[day][s]) == 0:
                    timetable[day][s].append(' ')
        return timetable
    except:
        return None


def create_timetable(time_slots, timetable, modules, total_hours, study_schedule):
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    table = []
    # Create table header
    header = ['Time Slots'] + days_of_week
    table.append(header)
    # Create table rows
    for time_slot in time_slots:
        row = [time_slot]
        for day in days_of_week:
            val = timetable[day][time_slot][0]
            row.append(val)
        table.append(row)
    i = 1
    for day in timetable:
        for module in modules:
            j = 1
            for j in range(total_hours + 1):
                if table[j][i] == ' ':
                    if study_schedule[day][module['moduleCode']][0] > 0:
                        table[j][i] = f"Study {module['moduleCode']}"
                        study_schedule[day][module['moduleCode']
                                            ][0] = study_schedule[day][module['moduleCode']][0] - 1
                        j = j + 1
        i = i + 1
    return table


def get_exam_table(modules, exam_dates):
    exam_table = []
    current_date = date.today()

    for module in modules:
        module_code = module['moduleCode']
        exam_date = exam_dates.get(module_code, '')
        if exam_date[0] != 'No Exam':
            exam_datetime = datetime.strptime(
                exam_date[0], "%Y-%m-%dT%H:%M:%S.%fZ").date()
            days_remaining = (exam_datetime - current_date).days
            row1 = [module_code, exam_date, days_remaining]
            exam_table.append(row1)
        else:
            row1 = [module_code, 'No Exam', 'N/A']
            exam_table.append(row1)
    return exam_table


def get_key_with_least_value(input_dict):
    if not input_dict:
        return None

    min_key = min(input_dict, key=input_dict.get)
    return min_key


def get_day_schedule(table, curr_day):
    days = table[0][1:]
    day_index = days.index(curr_day.capitalize()) + 1
    schedule = {}
    for i in table[1:]:
        schedule[i[0]] = i[day_index]
    return schedule


# This is the function that is responsible to send the entire schedule mail every morning
def send_mail_daily(table):

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()

        smtp.login('teamamen02@gmail.com', 'xgmtwtxxyubrvzwo')
        send_time = dt.datetime(2023, 7, 19, 15, 58, 0)
        curr_day = dt.date.today().strftime('%A')
        body = get_day_schedule(table, curr_day)
        string_representation = ''
        for key, value in body.items():
            string_representation += f"{key}: {value}\n\n"

        subject = f"{curr_day}\'s Schedule"

        msg = f'Subject: {subject}\n\n{string_representation}'

        smtp.sendmail('teamamen02@gmail.com', 'aaravrawal@gmail.com', msg)


def daily_email(table):
    days = table[0][1:]
    curr_day = dt.date.today().strftime('%A')
    day_index = days.index(curr_day.capitalize())
    while True:
        now = dt.datetime.now()
        if now.weekday() == day_index and now.hour == table[1][0][:2] and now.minute == 0:
            send_mail_daily(table)
            break


def send_mail_hourly(table, subject, hour):
    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()

        smtp.login('teamamen02@gmail.com', 'xgmtwtxxyubrvzwo')
        send_time = dt.datetime(2023, 7, 19, 15, 58, 0)
        # time.sleep(send_time.timestamp() - time.time())
        curr_day = dt.date.today().strftime('%A')

        body = f"It's {hour} and your task is {subject}"

        msg = f'Subject: {subject}\n\n{body}'

        smtp.sendmail('teamamen02@gmail.com', 'aaravrawal@gmail.com', msg)


def send_email_reminders(table, exam_dates):
    days = table[0][1:]
    curr_day = dt.date.today().strftime('%A')
    day_index = days.index(curr_day.capitalize())
    while True:
        now = dt.datetime.now()
        sched = get_day_schedule(table, curr_day)
        for i in sched.keys():
            if now.weekday() == day_index and now.hour == 8 and now.minute == 0 and now.second == 0:
                send_mail_daily(table)
            elif now.weekday() == day_index and now.hour == int(i[:2]) and now.minute == 0 and now.second == 0:
                send_mail_hourly(table, sched[i], i)
        if str(dt.date.today()) == get_key_with_least_value(exam_dates):
            break


@app.route('/generate', methods=['POST', 'GET'])
def generate_table():
    val = 'hello'
    if request.method == 'GET':
        return jsonify({'hello': val})
    data = request.get_json()
    starttime = data['startTime']
    total_hours = data['totalHours']
    modules = data['modules']
    timetable_data = get_timetable_data(modules)
    days = get_days_data(timetable_data)
    study = get_study_data(days, total_hours)
    total_study_time = get_total_study_time(study)
    module_workload = get_module_workload(modules)
    study_slots = get_study_slots(module_workload, total_study_time)
    study_schedule = get_study_schedule(modules, study_slots)
    time_slots = get_time_slots(starttime, total_hours)
    exam_dates = get_exam_dates(modules)
    timetable = get_timetable_data_1(days, time_slots, total_hours)
    table = create_timetable(time_slots, timetable,
                             modules, total_hours, study_schedule)
    exam_table = get_exam_table(modules, exam_dates)
    study_schedule = get_study_schedule(modules, study_slots)
    message = ""
    if data['sendEmailReminders']:
        try:
            message = "working"
            send_email_reminders(table, exam_dates)
        except:
            message = "Session Not Started"

    return jsonify(
        {'table': table,
         'totalStudyTime': total_study_time,
         'studySchedule': study_schedule['Monday'],
         'examDates': exam_table,
         'message': message
         }
    )


def analysis(result, result2):
    percentage_dict_1 = {
        key: (value / sum(result.values())) * 100 for key, value in result.items()}
    percentage_dict_2 = {
        key: (value / sum(result2.values())) * 100 for key, value in result2.items()}
    analysis_text = []
    for key in percentage_dict_1:
        value1 = percentage_dict_1[key]
        value2 = percentage_dict_2[key]
        if value1 > value2:
            analysis_text.append(
                "Looks like you've got to study {} more !!".format(key.upper()))
    return analysis_text


def count_elements(lst):
    counts = {}
    for element in lst:
        if element in counts:
            counts[element] += 1
        else:
            counts[element] = 1
    return counts


def predict_topic(question):
    # Text to numbers

    # nltk.download('all')

    # THE DATA
    df = pd.read_csv("orbital.csv")

    # In[2]:

    '''
    plt.figure(figsize=(10, 6))  # Set the figure size to 10 inches wide and 6 inches high
    plt.hist(df["Topic"], rwidth = 0.7)
    plt.show()
    '''

    # ## CLEANING TEXT

    # In[3]:

    text = list(df['Question'])
    corpus = []
    for i in range(len(text)):
        r = re.sub('[^a-zA-Z]', ' ', text[i])
        r = r.lower()
        r = r.split()
        r = [word for word in r if word not in ["the", "a", "an"]]
        r = ' '.join(r)
        corpus.append(r)

    # assign corpus to data['text']

    df['Question'] = corpus
    # df["Question"]

    # ## TOKENIZING AND MODEL PIPELINE

    # In[4]:

    # df = pd.read_csv("orbital.csv")

    # Convert text data into numerical features
    vectorizer = TfidfVectorizer()
    features = vectorizer.fit_transform(df["Question"])

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        features, df["Topic"], test_size=0.3, random_state=42)

    # Train the classifier (Random Forest Classifier)
    '''if os.path.exists('model.joblib'):
    # Load the saved model if it exists
        classifier = joblib.load('model.joblib')
    else: '''
    classifier = RandomForestClassifier()
    classifier.fit(X_train, y_train)

    # Predict the labels for the test set
    predictions = classifier.predict(X_test)

    # Calculate the accuracy of the classifier
    accuracy = accuracy_score(y_test, predictions)
    # print("Accuracy:", round(accuracy*100,2), "%")

    # Example usage: Predict the label for new text data
    # new_text = ["This is an AVL tree after inserting one alphabet into a height-balanced tree but before balancing. "]

    # clean the question also
    corpus = []
    r = re.sub('[^a-zA-Z]', ' ', question)
    r = r.lower()
    r = r.split()
    r = [word for word in r if word not in ["the", "a", "an"]]
    r = ' '.join(r)
    corpus.append(r)

    # assign corpus to data['text']

    question = corpus
    # print(question)
    new_features = vectorizer.transform(question)
    new_prediction = classifier.predict(new_features)
    # print("Prediction:", new_prediction[0])
    return new_prediction[0]


@app.route('/analyze', methods=['POST', 'GET'])
def analyze_questions():
    if request.method == 'GET':
        return jsonify('hello')
    data = request.get_json()
    questions = data['questions']

    all_topics = []
    for question in questions:
        all_topics.append(predict_topic(question))

    result = count_elements(all_topics)
    count = result.values()
    labels = result.keys()
    piecount = list(count)
    pielabels = list(labels)
    plt.pie(count, labels=labels, autopct='%1.1f%%')
    plt.title("Analysis of questions you entered")

    # Save the chart image as bytes
    chart1_bytes = io.BytesIO()
    plt.savefig(chart1_bytes, format='png')
    chart1_bytes.seek(0)

    # Clear the current figure
    plt.clf()

    df = pd.read_csv("orbital.csv")
    topics = list(df[df['Topic'].isin(all_topics)]['Topic'])
    result2 = count_elements(topics)
    count = result2.values()
    labels = result2.keys()
    piecount1 = list(count)
    pielabels1 = list(labels)
    plt.pie(count, labels=labels, autopct='%1.1f%%')
    plt.title("Analysis of previous year questions")

    # Save the chart image as bytes
    chart2_bytes = io.BytesIO()
    plt.savefig(chart2_bytes, format='png')
    chart2_bytes.seek(0)

    # Convert bytes to base64 encoded strings
    chart1_base64 = base64.b64encode(chart1_bytes.getvalue()).decode('utf-8')
    chart2_base64 = base64.b64encode(chart2_bytes.getvalue()).decode('utf-8')

    # Generate the analysis text
    analysis_text = []
    for key, value in result.items():
        percentage = (value / sum(result.values())) * 100
        analysis_text.append(
            f"Looks like you need to study {key.upper()} more! The percentage is {percentage}%")
    pie_data_list = [{'name': label, 'value': count}
                     for label, count in zip(pielabels, piecount)]
    pie_data_list_1 = [{'name': label, 'value': count}
                       for label, count in zip(pielabels1, piecount1)]
    return jsonify({
        'analysis': analysis_text,
        'chart1': chart1_base64,
        'chart2': chart2_base64,
        'piedata': pie_data_list,
        'piedata1': pie_data_list_1
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
