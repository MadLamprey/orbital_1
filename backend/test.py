import unittest
import main
from main import (
    fetch_module_info,
    calculate_module_workload,
    fetch_timetable_data,
    get_timetable_data,
    get_days_data,
    get_study_data,
    get_total_study_time,
    get_module_workload,
    get_study_slots,
    get_study_schedule,
    get_time_slots,
    fetch_exam_dates,
    get_exam_dates,
    get_timetable_data_1,
    create_timetable,
    get_exam_table
)
import json


class TestTimetable(unittest.TestCase):
    def setUp(self):
        self.app = main.app.test_client()

    def test_fetch_module_info(self):
        # Test case for successful response
        module_code = 'CS1010'
        module_info = fetch_module_info(module_code)
        self.assertNotEqual(module_info, None)

    # Test case for failed response
        module_code = 'INVALID'
        module_info = fetch_module_info(module_code)
        self.assertEqual(
            module_info, "Failed to fetch module information for INVALID")

    def test_calculate_module_workload(self):
        # Test case for successful response
        module_code = 'CS1101S'
        workload = calculate_module_workload(module_code)
        self.assertEqual(workload, 7.0)

    # Test case for failed response
        module_code = 'INVALID'
        workload = calculate_module_workload(module_code)
        self.assertEqual(workload, None)

    def test_fetch_timetable_data(self):
        # Test case for successful response
        module_code = 'CS1101S'
        timetable_data = fetch_timetable_data(module_code)
        self.assertNotEqual(timetable_data, None)
        self.assertEqual(timetable_data[0]['lessonType'], 'Tutorial')

    # Test case for failed response
        module_code = 'INVALID'
        timetable_data = fetch_timetable_data(module_code)
        self.assertEqual(timetable_data, None)

    def test_get_timetable_data(self):
        # Test 1
        modules = [{'moduleCode': 'CS1101S', 'lessons': [
            {'lessonType': 'Lecture', 'classNumber': '1'}]}]
        timetable_data = get_timetable_data(modules)
        self.assertEqual(timetable_data['CS1101S']
                         ['Lecture'][0]['classNo'], '1')

    # Test 2
        modules = modules = [{'moduleCode': 'CS1101S', 'lessons': [
            {'lessonType': 'Lecture', 'classNumber': '5'}]}]
        timetable_data = get_timetable_data(modules)
        self.assertEqual(timetable_data['CS1101S']['Lecture'], [])

    def test_get_days_data(self):
        # Test 1
        timetable_data = {'CS1101S': {'Tutorial': [], 'Recitation': [], 'Lecture': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                                                                                                                       10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Friday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}, {'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Wednesday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}}

        days_data = get_days_data(timetable_data)
        self.assertEqual(days_data['Friday']['CS1101S'][0]['classNo'], '1')

    # Test 2
        timetable_data = {'CS1101S': {'Tutorial': [], 'Recitation': [], 'Lecture': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                                                                                                                       10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Friday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}, {'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Wednesday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}}

        days_data = get_days_data(timetable_data)
        self.assertEqual(days_data['Monday'], {})

    def test_get_study_data(self):
        # Test 1
        days_data = {'Monday': {}, 'Tuesday': {}, 'Wednesday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Wednesday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}, 'Thursday': {
        }, 'Friday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Friday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}}

        study = get_study_data(days_data, 17)
        self.assertEqual(study['Friday'][0], 15.0)

    # Test 2
        days_data = {'Monday': {}, 'Tuesday': {}, 'Wednesday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Wednesday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}, 'Thursday': {
        }, 'Friday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Friday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}}

        study = get_study_data(days_data, 17)
        self.assertEqual(study['Monday'][0], 17)

    def test_get_total_study_time(self):
        # Test 1
        study_data = {'Monday': [17], 'Tuesday': [17], 'Wednesday': [
            15.0], 'Thursday': [17], 'Friday': [15.0]}

        total_study_time = get_total_study_time(study_data)
        self.assertEqual(total_study_time, 81.0)

    # Test 2
        study_data = {'Monday': ['a'], 'Tuesday': [17], 'Wednesday': [
            15.0], 'Thursday': [17], 'Friday': [15.0]}

        total_study_time = get_total_study_time(study_data)
        self.assertEqual(total_study_time, 0)

    def test_get_module_workload(self):
        # Test 1
        modules = [{'moduleCode': 'CS1101S', 'lessons': [
            {'lessonType': 'Lecture', 'classNumber': '1'}]}]

        module_workloads = get_module_workload(modules)
        self.assertEqual(module_workloads['CS1101S'], 7.0)

    # Test 2
        modules = [{'moduleCode': 'ABC123', 'lessons': [
            {'lessonType': 'Lecture', 'classNumber': '1'}]}]

        module_workloads = get_module_workload(modules)
        self.assertEqual(module_workloads['ABC123'], None)

    def test_get_study_slots(self):
        # Test 1
        module_workloads = {'CS1101S': 7.0, 'CS1231S': 10.0}

        study_slots = get_study_slots(module_workloads, 58)
        self.assertEqual(study_slots['CS1101S'], 24)

    # Test 2
        module_workloads = {'CS1101S': 1.0, 'CS1231S': 1.0}

        study_slots = get_study_slots(module_workloads, 10)
        self.assertEqual(study_slots['CS1101S'], 5)

    def test_get_study_schedule(self):
        # Test 1
        modules = [{'moduleCode': 'CS1101S', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}, {
            'moduleCode': 'CS1231S', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}]
        study_slots = {'CS1101S': 23, 'CS1231S': 23}

        study_schedule = get_study_schedule(modules, study_slots)
        self.assertEqual(study_schedule['Monday']['CS1101S'][0], 4)

    # Test 2
        modules = [{'moduleCode': 'CS1101S', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}, {
            'moduleCode': 'CS1231S', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}]
        study_slots = {'CS1101S': 23}

        study_schedule = get_study_schedule(modules, study_slots)
        self.assertEqual(study_schedule['Monday'], {})

    def test_get_time_slots(self):
        # Test 1
        starttime = '0800'
        total_hours = 24

        time_slots = get_time_slots(starttime, total_hours)
        self.assertEqual(time_slots[len(time_slots) - 1], '0700-0800')

    # Test 2
        starttime = '0000'
        total_hours = 0

        time_slots = get_time_slots(starttime, total_hours)
        self.assertEqual(time_slots, [])

    def test_fetch_exam_dates(self):
        # Test 1
        module_code = 'CS1231S'

        exam_date = fetch_exam_dates(module_code)
        self.assertEqual(str(exam_date)[8:10], '24')

    # Test 2
        module_code = 'IS1108'

        exam_date = fetch_exam_dates(module_code)
        self.assertEqual(exam_date, 'No Exam')

    def test_get_exam_dates(self):
        # Test 1
        modules = [{'moduleCode': 'CS1101S', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}, {
            'moduleCode': 'CS1231S', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}]

        exam_dates = get_exam_dates(modules)
        self.assertEqual(exam_dates['CS1101S'][0][8:10], '22')

    # Test 2
        modules = [{'moduleCode': 'CS1101S', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}, {
            'moduleCode': 'IS1108', 'lessons': [{'lessonType': 'Lecture', 'classNumber': '1'}]}]

        exam_dates = get_exam_dates(modules)
        self.assertEqual(exam_dates['IS1108'][0], 'No Exam')

    def test_get_timetable_data_1(self):
        # Test 1
        days_data = {'Monday': {}, 'Tuesday': {}, 'Wednesday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Wednesday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}, 'Thursday': {
        }, 'Friday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Friday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}}
        time_slots = ['0800-0900', '0900-1000',
                      '1000-1100', '1100-1200', '1200-1300']
        total_hour = 5

        timetable = get_timetable_data_1(days_data, time_slots, total_hour)
        self.assertEqual(timetable['Wednesday']
                         ['1100-1200'][0], '(CS1101S, Lecture)')

    # Test 2
        days_data = {'Monday': {}, 'Tuesday': {}, 'Wednesday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Wednesday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}, 'Thursday': {
        }, 'Friday': {'CS1101S': [{'classNo': '1', 'startTime': '1000', 'endTime': '1200', 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'venue': 'E-Learn_C', 'day': 'Friday', 'lessonType': 'Lecture', 'size': 790, 'covidZone': 'Unknown'}]}}
        time_slots = ['0800-0900', '0900-1000',
                      '1000-1100', '1100-1200', '1200-1300']
        total_hour = 5

        timetable = get_timetable_data_1(days_data, time_slots, total_hour)
        self.assertEqual(timetable['Wednesday']['1200-1300'][0], ' ')

    def test_create_timetable(self):
        # Test 1
        timetable = {'Monday': {'0800-0900': [' '], '0900-1000': [' '], '1000-1100': [' '], '1100-1200': [' '], '1200-1300': [' ']}, 'Tuesday': {'0800-0900': [' '], '0900-1000': [' '], '1000-1100': [' '], '1100-1200': [' '], '1200-1300': [' ']}, 'Wednesday': {'0800-0900': [' '], '0900-1000': [' '], '1000-1100': [
            '(CS1101S, Lecture)'], '1100-1200': ['(CS1101S, Lecture)'], '1200-1300': [' ']}, 'Thursday': {'0800-0900': [' '], '0900-1000': [' '], '1000-1100': [' '], '1100-1200': [' '], '1200-1300': [' ']}, 'Friday': {'0800-0900': [' '], '0900-1000': [' '], '1000-1100': ['(CS1101S, Lecture)'], '1100-1200': ['(CS1101S, Lecture)'], '1200-1300': [' ']}}
        time_slots = ['0800-0900', '0900-1000',
                      '1000-1100', '1100-1200', '1200-1300']
        total_hours = 5
        modules = [{'moduleCode': 'CS1101S', 'lessons': [
            {'lessonType': 'Lecture', 'classNumber': '1'}]}]
        study_schedule = {'Monday': {'CS1101S': [4.0]}, 'Tuesday': {'CS1101S': [4.0]}, 'Wednesday': {
            'CS1101S': [4.0]}, 'Thursday': {'CS1101S': [4.0]}, 'Friday': {'CS1101S': [4.0]}}

        table = create_timetable(
            time_slots, timetable, modules, total_hours, study_schedule)
        expected_table = [['Time Slots', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], ['0800-0900', 'Study CS1101S', 'Study CS1101S', 'Study CS1101S', 'Study CS1101S', 'Study CS1101S'], ['0900-1000', 'Study CS1101S', 'Study CS1101S', 'Study CS1101S', 'Study CS1101S', 'Study CS1101S'],
                          ['1000-1100', 'Study CS1101S', 'Study CS1101S', '(CS1101S, Lecture)', 'Study CS1101S', '(CS1101S, Lecture)'], ['1100-1200', 'Study CS1101S', 'Study CS1101S', '(CS1101S, Lecture)', 'Study CS1101S', '(CS1101S, Lecture)'], ['1200-1300', ' ', ' ', 'Study CS1101S', ' ', 'Study CS1101S']]
        self.assertEqual(table, expected_table)

    def test_get_exam_table(self):
        # Test 1
        modules = [{'moduleCode': 'CS1101S', 'lessons': [
            {'lessonType': 'Lecture', 'classNumber': '1'}]}]
        exam_dates = {'CS1101S': ['2022-11-22T05:00:00.000Z']}

        exam_table = get_exam_table(modules, exam_dates)
        self.assertEqual(exam_table[0][2], 153)

    # Test 2
        modules = [{'moduleCode': 'IS1108', 'lessons': [
            {'lessonType': 'Lecture', 'classNumber': '1'}]}]
        exam_dates = {'IS1108': ['No Exam']}

        exam_table = get_exam_table(modules, exam_dates)
        self.assertEqual(exam_table[0][2], 'N/A')

    def test_generate_timetable(self):
        # Test 1
        data = {
            'startTime': '0800',
            'totalHours': 10,
            'modules': [
                {'moduleCode': 'CS1101S', 'lessons': [
                    {'lessonType': 'Lecture', 'classNumber': '1'}]},
                {'moduleCode': 'MA2001', 'lessons': [
                    {'lessonType': 'Lecture', 'classNumber': '2'}]}
            ]
        }
        expected_keys = ['table', 'totalStudyTime',
                         'studySchedule', 'examDates']

        response = self.app.post('/generate', json=data)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertListEqual(
            sorted(list(response_data.keys())), sorted(expected_keys))

    # Test 2
        data = {
            'startTime': '0800',
            'totalHours': 14,
            'modules': [
                {'moduleCode': 'CS1101S', 'lessons': [
                    {'lessonType': 'Lecture', 'classNumber': '1'}]},
                {'moduleCode': 'CS1231S', 'lessons': [
                    {'lessonType': 'Lecture', 'classNumber': '1'}]}
            ]
        }
        expected_keys = ['table', 'totalStudyTime',
                         'studySchedule', 'examDates']

        response = self.app.post('/generate', json=data)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertListEqual(
            sorted(list(response_data.keys())), sorted(expected_keys))
        self.assertEqual(response_data['totalStudyTime'], 63.0)


if __name__ == '__main__':
    unittest.main()
