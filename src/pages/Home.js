import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import logo from "./resources/logo_alt.png";
import PredictionModel from "./PredictionModel";
import TimetableGenerator from "./TimetableGenerator";
import { auth } from "../firebase";

const Home = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("prediction");
  useEffect(() => {
    // Check if the user is already authenticated
    const user = auth.currentUser;
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  }, []);
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };
  console.log(user)

  return (
    <>
      <div className="header">
        <div className="logo">
          <Link to="/home">
            <img src={logo} height="100px" alt="logo" />
          </Link>
        </div>
        <nav className="navbar">
          <ul>
            <Link to="/home" className="link">
              <li>Home</li>
            </Link>
            <Link to="/about" className="link">
              <li>About</li>
            </Link>
            <Link to="/team" className="link">
              <li>The Team</li>
            </Link>
            <Link to="/contact" className="link">
              <li>Contact Us</li>
            </Link>
          </ul>
        </nav>
      </div>
      <hr />
      <div className="tab-section">
        <div className="tab-buttons">
          <button
            className={`tab-button ${
              activeTab === "prediction" ? "active" : ""
            }`}
            onClick={() => toggleTab("prediction")}
          >
            Prediction Model
          </button>
          <button
            className={`tab-button ${
              activeTab === "otherFunctionality" ? "active" : ""
            }`}
            onClick={() => toggleTab("otherFunctionality")}
          >
            Timetable
          </button>
        </div>
        <div>
          {activeTab === "prediction" && <PredictionModel />}
          {activeTab === "otherFunctionality" && <TimetableGenerator />}
        </div>
      </div>
    </>
  );
};

export default Home;
