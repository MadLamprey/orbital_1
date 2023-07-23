import React, { useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const TimetableGenerator = () => {
  const [startTime, setStartTime] = useState("");
  const [totalHours, setTotalHours] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [studySchedule, setStudySchedule] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [sendEmailReminders, setSendEmailReminders] = useState(false);
  const [sessionNotStarted, setSessionNotStarted] = useState(false);

  const handleEmailReminderToggle = () => {
    if (sessionNotStarted && !sendEmailReminders) {
      alert(
        "Session has not yet started. Email reminders will only be sent once term starts."
      );
      setSendEmailReminders(!sendEmailReminders);
    } else {
      setSendEmailReminders(!sendEmailReminders);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleTotalHoursChange = (event) => {
    setTotalHours(parseInt(event.target.value));
  };

  const handleModuleCodeChange = (index, event) => {
    const modules = [...moduleData];
    modules[index].moduleCode = event.target.value;
    setModuleData(modules);
  };

  const handleLessonTypeChange = (moduleIndex, lessonIndex, event) => {
    const modules = [...moduleData];
    modules[moduleIndex].lessons[lessonIndex].lessonType = event.target.value;
    setModuleData(modules);
  };

  const handleClassNumberChange = (moduleIndex, lessonIndex, event) => {
    const modules = [...moduleData];
    modules[moduleIndex].lessons[lessonIndex].classNumber = event.target.value;
    setModuleData(modules);
  };

  const handleAddModule = () => {
    const modules = [...moduleData];
    modules.push({ moduleCode: "", lessons: [] });
    setModuleData(modules);
    setShowButton(true);
  };

  const handleRemoveModule = (moduleIndex) => {
    const modules = [...moduleData];
    modules.splice(moduleIndex, 1);
    setModuleData(modules);
  };

  const generateTable = async () => {
    try {
      setError("");
      const response = await fetch(
        "https://timetable-server-nulcnhp3eq-el.a.run.app/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startTime,
            totalHours,
            modules: moduleData.map((module) => ({
              moduleCode: module.moduleCode,
              lessons: module.lessons.map((lesson) => ({
                lessonType: lesson.lessonType,
                classNumber: lesson.classNumber,
              })),
            })),
            sendEmailReminders,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.message === "Session Not Started") {
        setSessionNotStarted(true);
      }
      setTableData(data.table);
      setTotalStudyTime(data.totalStudyTime);
      setStudySchedule(data.studySchedule);
      setExamDates(data.examDates);
      setShow(true);
    } catch (error) {
      setError(
        "Failed to fetch data from the backend. Ensure fields have been filled correctly"
      );
    }
  };

  const PDFDocument = () => {
    const styles = StyleSheet.create({
      page: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
      },
      content: {
        margin: 10,
        flex: 1,
      },
      cell: {
        padding: 5,
        border: "1px solid #000000",
        fontSize: 8,
        width: 60,
      },
    });

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.content}>
            {tableData.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: "row" }}>
                {row.map((cell, cellIndex) => (
                  <Text key={cellIndex} style={styles.cell}>
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <div>
      <label>
        Time of day when you would like to start studying:
        <input
          type="text"
          value={startTime}
          onChange={handleStartTimeChange}
          className="text-input"
        />
      </label>
      <br />
      <label>
        Total Hours a day you wish to spend studying:
        <input
          type="number"
          value={totalHours}
          onChange={handleTotalHoursChange}
          className="text-input"
        />
      </label>
      <br />
      {moduleData.map((module, moduleIndex) => (
        <div key={moduleIndex}>
          <label>Module Code:</label>
          <input
            type="text"
            value={module.moduleCode}
            onChange={(event) => handleModuleCodeChange(moduleIndex, event)}
            className="text-input"
          />

          {module.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex}>
              <label>Lesson Type:</label>
              <input
                type="text"
                value={lesson.lessonType}
                onChange={(event) =>
                  handleLessonTypeChange(moduleIndex, lessonIndex, event)
                }
                className="text-input"
              />

              <label>Class Number:</label>
              <input
                type="text"
                value={lesson.classNumber}
                onChange={(event) =>
                  handleClassNumberChange(moduleIndex, lessonIndex, event)
                }
                className="text-input"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => handleRemoveModule(moduleIndex)}
            className="my-button_s"
          >
            Remove Module
          </button>

          <button
            type="button"
            onClick={() => {
              const modules = [...moduleData];
              modules[moduleIndex].lessons.push({
                lessonType: "",
                classNumber: "",
              });
              setModuleData(modules);
            }}
            className="my-button_s"
          >
            Add Lesson
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddModule} className="my-button_s">
        Add Module
      </button>
      {show && (
        <>
          <p>Your total study time for the week is: {totalStudyTime} hours</p>
          <p>
            In order to meet your study goal, you must study each module for the
            given number of hours:
          </p>
          <ul>
            {Object.entries(studySchedule).map(([module, hours]) => (
              <li key={module}>
                {module}: {hours[0]} hours
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p>{error}</p>}
      {show && (
        <>
          <hr />
          <p>Your timetable for the week is:</p>
          <table className="timetable">
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {editMode &&
                      index > 0 &&
                      cellIndex > 0 &&
                      !cell.includes("(") ? (
                        <input
                          type="text"
                          value={cell}
                          onChange={(event) => {
                            const updatedTableData = [...tableData];
                            updatedTableData[index][cellIndex] =
                              event.target.value;
                            setTableData(updatedTableData);
                          }}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={toggleEditMode} className="my-button_s">
            {editMode ? "Finish Editing" : "Edit Timetable"}
          </button>
        </>
      )}

      {showButton && (
        <>
          <hr />
          <button onClick={generateTable} className="my-button_s">
            Generate TimeTable
          </button>
          <PDFDownloadLink
            document={<PDFDocument />}
            fileName="timetable.pdf"
            className="my-button_s"
          >
            {({ loading }) =>
              loading ? "Loading..." : "Download Timetable as PDF"
            }
          </PDFDownloadLink>
          <br></br>
          <label>
            <input
              type="checkbox"
              checked={sendEmailReminders}
              onChange={handleEmailReminderToggle}
            />
            Send Email Reminders
          </label>
        </>
      )}

      {show && (
        <>
          <h2>Exam Dates</h2>
          <table className="timetable">
            <thead>
              <tr>
                <th>Module Code</th>
                <th>Exam Date</th>
                <th>Days Remaining</th>
              </tr>
            </thead>
            <tbody>
              {examDates.map((row, index) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>{row[1].toLocaleString().substring(0, 10)}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
        </>
      )}
    </div>
  );
};

export default TimetableGenerator;
