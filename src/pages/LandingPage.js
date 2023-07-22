import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./resources/logo_alt.png";
import { auth } from "../firebase";

const LandingPage = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div class="header">
        <img class="logo" src={logo} height="100px" alt="logo" />
        <nav class="navbar">
          <ul>
            <Link to="/home" class="link">
              <li>Home</li>
            </Link>
            <Link to="/about" class="link">
              <li>About</li>
            </Link>
            <Link to="/team" class="link">
              <li>The Team</li>
            </Link>
            <Link to="/contact" class="link">
              <li>Contact Us</li>
            </Link>
          </ul>
        </nav>
      </div>
      <hr />
      <div class="sec">
        <div class="left-section">
          Make the most of your time and resources.
          <div class="subtext_1">
            We help you prepare for your exams better.
          </div>
          <div class="subtext_2">Register now to get started.</div>
        </div>
        <div class="right-section">
          <Link to="/register">
            <button class="my-button">Register Now</button>
          </Link>
          <div class="subtext_1">Already a registered user?</div>
          <div class="subtext_2">Log In instead</div>
          <Link to="/login">
            <button class="my-button_s">Log In</button>
          </Link>
        </div>
      </div>
      <hr class="blank" />
    </div>
  );
};

export default LandingPage;
