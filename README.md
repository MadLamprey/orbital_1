# NUS Orbital 2023 (Team Name: Amen)
[![ReactJS](https://img.shields.io/badge/ReactJS-18.2.0-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9-blue.svg)](https://www.python.org/)
[![CSS](https://img.shields.io/badge/CSS-3-blue.svg)](https://www.w3.org/Style/CSS/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28.svg)](https://firebase.google.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Platform-4285F4.svg?logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
![Background](https://github.com/MadLamprey/orbital_1/assets/114080910/f466d8a4-52be-43de-b353-2602f38f8984)

Orbital (Independent Software Development Project) is NUS School of Computing self-directed, independent work course.
Our Team consists of Misra Aditya and Aarav Rawal

**Proposed Level of Achievement:** Apollo 11

## ScoreScope

ScoreScope is a web app that analyses past papers, tutorial sheets and other resource material and returns topics that are most frequently tested on. It also generates a timetable for the user on the basis of their classes, and study slots suggested on the basis of the respective course workloads.

**Project Poster:** [Link](https://drive.google.com/file/d/143oHpcAQF40Jp7PqA30QOhng9YwWtAdv/view?usp=drive_link)
**Project Video:** [Link](https://drive.google.com/file/d/1Q1tdY0cyyrLHQhrWLRUeESkQoExQ5DMS/view?usp=drive_link)

### Motivation

Our primary motivation in creating ScoreScope was to empower students and to provide them with a tool that assists them in all stages of the learning process. We wanted to help students in their preparation leadings up to the exams, as well as, help them manage their time so as to maximise productivity.

### Aim

We envision ScoreScope as an important tool in the life of students and as handy a tool as NUSMods or Canvas. ScoreScope should be a student’s companion throughout the semester - at the beginning so that the student has a better idea as to the key topics to be learned and as a planning tool, during the semester to assist in tutorials, and playing a key role in recess and examination week as a tool to summarise the student’s learnings. Our aim is to make ScoreScope an integral part of the education system at NUS and possibly expand to students and educators from other universities as well.

### Key Features:

* Prediction Model that takes questions as inputs and analyses frequency of topics of each question, compares them with frequency of topics in past papers, and then generates an analysis
* Pie Charts to better explain the analysis
* TImetable Generator that creates a timetable for students that integrates their class schedules as well as study slots for each of their courses
* Editing abilities for the user to personalise the timetable
* Summary of exam dates and days remaining
* Email reminders sent to users for upcoming activities

### Documentation

[Milestone Report](https://docs.google.com/document/d/14D3iLilm3exPZcXS1fS1E62lHs5rF2QcSNCVN8pZ6Gs/edit?usp=sharing)

[Project Log](https://docs.google.com/spreadsheets/d/1aUZa8m8NoIJe4e4sbFjpxP1UqflPsqiuyDhIv8czLyI/edit?usp=sharing)

### Deployment

It has been hosted on Firebase, and the link for the website is: 
[Deployment Link](https://scorescope-49a24.web.app/)

The backend server has been hosted on Google Cloud Run and the link for the same is:
[Backend Server](http://backend-scorescope-nulcnhp3eq-el.a.run.app/)

Route for Prediction Functionality: [Prediction Route](http://backend-scorescope-nulcnhp3eq-el.a.run.app/analyze)

Route for Timetable Functionality: [Timetable Route](http://backend-scorescope-nulcnhp3eq-el.a.run.app/generate)
