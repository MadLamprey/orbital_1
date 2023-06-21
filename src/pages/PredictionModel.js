import React, { useState, useEffect } from "react";
import axios from "axios";

const PredictionModel = () => {
  const [question, setQuestion] = useState("");
  const [prediction, setPrediction] = useState("");
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    fetchAccuracy();
  }, []);

  const fetchAccuracy = async () => {
    try {
      const response = await axios.get(
        "https://flask-server-7slp5aoiia-el.a.run.app/predict"
      );
      setAccuracy(response.data.accuracy);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrediction = async () => {
    try {
      const response = await axios.post(
        "https://flask-server-7slp5aoiia-el.a.run.app/predict",
        { question }
      );
      const prediction = response.data.prediction;
      setPrediction(prediction);
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
          <p>Enter Question</p>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="text-input"
          />
          <br />
          <div>
            <button onClick={handlePrediction} className="alt-button">
              Predict
            </button>
          </div>
          <br />
          <br />
          <div className="small-box-section">
            <div className="small-box">
              {accuracy && (
                <h4>
                  Accuracy: {accuracy}
                  {fetchAccuracy}
                </h4>
              )}
              {prediction && <h4>Prediction: {prediction}</h4>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionModel;
