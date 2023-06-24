import React, { useState } from "react";

const PredictionModel = () => {
  const [questions, setQuestions] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);

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
      const response = await fetch(
        "https://backend-scorescope-nulcnhp3eq-el.a.run.app/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questions,
          }),
        }
      );

      const data = await response.json();
      setAnalysis(data.analysis);
      setChart1(`data:image/png;base64,${data.chart1}`);
      setChart2(`data:image/png;base64,${data.chart2}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="box-section_1">
      <div className="box">
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
      <div className="small-box-section">
        <div className="small-box">
          {analysis && (
            <>
              <h4>Analysis:</h4>
              <ul>
                {analysis.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {chart1 && (
            <div>
              <h4>Chart 1:</h4>
              <img src={chart1} alt="Chart 1" />
            </div>
          )}
          {chart2 && (
            <div>
              <h4>Chart 2:</h4>
              <img src={chart2} alt="Chart 2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionModel;
