from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, date

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
        print(f"Failed to fetch module information for {module_code}")
        return None

# Function to calculate module workload
def calculate_module_workload(module):
    module_info = fetch_module_info(module)
    workload = module_info['workload']
    total_workload = 0.0
    for val in workload:
        total_workload += val
    return total_workload

# Function to fetch timetable data for a module
def fetch_timetable_data(module_code):
    url = f"{API_BASE_URL}2022-2023/modules/{module_code}.json"
    response = requests.get(url)
    if response.status_code == 200:
        res = response.json()
        return res['semesterData'][0]['timetable']
    else:
        print(f"Failed to fetch timetable data for {module_code}")
        return None
    
def get_timetable_data(modules):
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
                    timetable_data[module['moduleCode']][lesson].append(activity)
    return timetable_data

def get_days_data(timetable_data):
    days = {'Monday':{}, 'Tuesday':{}, 'Wednesday':{}, 'Thursday':{}, 'Friday':{}}
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
                start_time = datetime.strptime(activity['startTime'], "%H%M").time()
                end_time = datetime.strptime(activity['endTime'], "%H%M").time()
                duration = (datetime.combine(date.today(), end_time) - datetime.combine(date.today(), start_time)).seconds / 3600
                study_time -= duration
        study[day].append(study_time)
    return study

def get_total_study_time(study):
    total_study_time = 0
    for day in study:
        total_study_time += study[day][0]
    return total_study_time

def get_module_workload(modules):
    module_workload = {}
    for module in modules:
        workload = calculate_module_workload(module['moduleCode'])
        module_workload[module['moduleCode']] = workload
    return module_workload

def get_study_slots(module_workload, total_study_time):
    total_workload = sum(module_workload.values())
    study_slots = {}
    for module, workload in module_workload.items():
        slots = int(round(total_study_time * (workload / total_workload)))
        study_slots[module] = slots
    return study_slots

def get_study_schedule(modules, study_slots):
    study_schedule = {'Monday': {}, 'Tuesday': {}, 'Wednesday': {}, 'Thursday': {}, 'Friday': {}}
    for day in study_schedule:
        for module in modules:
            study_schedule[day][module['moduleCode']] = []
        for module in modules:
            study_schedule[day][module['moduleCode']].append(study_slots[module['moduleCode']] // 5)
    return study_schedule

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
    url = f"{API_BASE_URL}2022-2023/modules/{module_code}.json"
    response = requests.get(url)
    if response.status_code == 200:
        res = response.json()
        return res['semesterData'][0]['examDate']
    else:
        print(f"Failed to fetch exam dates for {module_code}")
        return None
    
def get_exam_dates(modules):
    exam_dates = {}
    for module in modules:
        exam_dates[module['moduleCode']] = []
    for module in modules:
        exam_dates[module['moduleCode']].append(fetch_exam_dates(module['moduleCode']))
    return exam_dates

@app.route('/generate', methods=['POST'])
def generate_table():
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
    print(exam_dates)
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    timetable = {'Monday': {}, 'Tuesday': {}, 'Wednesday': {}, 'Thursday': {}, 'Friday': {}}

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
                            new_end_time = "0" + str(int(start__time) + 100)
                        timetable[day][f"{int(start__time)}-{new_end_time}"].append(f"({mod}, {activity['lessonType']})")
                        start__time = new_end_time
                else:
                    if (int(start__time) + 100) >= 1000:
                            new_end_time = str(int(start__time) + 100)
                    else:
                        new_end_time = "0" + str(int(start__time) + 100)
                    timetable[day][f"{start__time}-{new_end_time}"].append(f"({mod}, {activity['lessonType']})")
                    start__time = new_end_time

    for day in timetable:
            for s in timetable[day]:
                if len(timetable[day][s]) == 0:
                    timetable[day][s].append(' ')


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
                        study_schedule[day][module['moduleCode']][0] = study_schedule[day][module['moduleCode']][0] - 1
                        j = j + 1
        i = i + 1

    exam_table = []
    current_date = date(2022, 6, 21)
    print(current_date)
    
    for module in modules:
        module_code = module['moduleCode']
        exam_date = exam_dates.get(module_code, '')
        if exam_date:
            exam_datetime = datetime.strptime(exam_date[0], "%Y-%m-%dT%H:%M:%S.%fZ").date()
            days_remaining = (exam_datetime - current_date).days
            row1 = [module_code, exam_date, days_remaining]
            exam_table.append(row1)
    
        
    study_schedule = get_study_schedule(modules, study_slots)
    return jsonify(
        {'table': table,
         'totalStudyTime': total_study_time,
         'studySchedule': study_schedule['Monday'],
         'examDates': exam_table
         }
    )

if __name__ == '__main__':
    app.run(debug=True)
