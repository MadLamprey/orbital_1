import React, { useState, useCallback } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { useCurrentPng } from "recharts-to-png";
import { MdFileDownload } from "react-icons/md";
import FileSaver from "file-saver";

const PredictionModel = () => {
  const [questions, setQuestions] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [boxHeight] = useState("auto");
  const [pieData, setPieData] = useState([]);
  const [pieData1, setPieData1] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  const addQuestionField = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const handlePrediction = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
        }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
      setPieData(data.piedata);
      setPieData1(data.piedata1);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4B4B",
  ];

  const [getPiePng, { ref: pieRef}] = useCurrentPng();
  const handlePieDownload = useCallback(async () => {
    const png = await getPiePng();
    if (png) {
      FileSaver.saveAs(png, "chart-1.png");
    }
  }, [getPiePng]);

  const [getPiePng1, { ref: pieRef1}] = useCurrentPng();
  const handlePieDownload1 = useCallback(async () => {
    const png = await getPiePng1();
    if (png) {
      FileSaver.saveAs(png, "chart-2.png");
    }
  }, [getPiePng1]);

  return (
    <div className="box-section_1">
      <div className="box" style={{ height: boxHeight }}>
        <div className="inner-box">
          <h1 className="box-heading">Prediction Model</h1>
        </div>
        <div>
          <p>Enter Questions</p>
          {questions.map((question, index) => (
            <div key={index}>
              <input
                type="text"
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="text-input"
              />
            </div>
          ))}
          <br />
          <button onClick={addQuestionField} className="alt-button">
            Add Question
          </button>
          <button onClick={handlePrediction} className="alt-button">
            Predict
          </button>
          <br />
          <br />
        </div>
      </div>
      <div className="analysis">
        <div className="small-box">
          {analysis.length > 0 && (
            <>
              <h4>Analysis:</h4>
              <ul>
                {analysis.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <div className="pie-container">
            {pieData.length > 0 && (
              <div className="pie-chart">
                <div className="chart-box">
                  <h4>Chart 1:</h4>
                  <PieChart width={500} height={500} ref={pieRef}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      label={renderCustomizedLabel}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                  <button
                    onClick={handlePieDownload}
                    className="alt-button"
                  >
                    <MdFileDownload />
                  </button>
                </div>
              </div>
            )}

            {pieData1.length > 0 && (
              <div className="pie-chart">
                <div className="chart-box">
                  <h4>Chart 2:</h4>
                  <PieChart width={500} height={500} ref={pieRef1}>
                    <Pie
                      data={pieData1}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      label={renderCustomizedLabel}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[(index + 2) % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                  <button
                    onClick={handlePieDownload1}
                    className="alt-button"
                  >
                    <MdFileDownload />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionModel;
