import React from "react";
import { Link } from "react-router-dom";
import logo from "./resources/logo_alt.png";
import poster from "./resources/5456.png";
import ReactPlayer from "react-player";

const About = () => {
  return (
    <>
      <div className="header">
        <div className="logo">
          <Link to="/home">
            <img src={logo} height="100px" alt="logo" />
          </Link>
        </div>
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
      <div class="team-box-section">
        <div class="team-box">
          <h2>About ScoreScope</h2>
        </div>
      </div>
      <div>
        <div className="box-section">
          <div className="content-box">
            ScoreScope is a text classification program that aims to analyse
            past papers for particular modules. Based on a simple text analyser,
            it studies the questions on the past papers and returns what topics
            have been tested on most frequently. This enables students who make
            use of this program to be able to narrow down their syllabus to only
            a few topics that they can revise in the time leading up to the
            exam.{" "}
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column-1">
          <h2>Project Poster</h2>
          <img src={poster} class="image" alt="poster" />
        </div>
        <div class="column">
          <h2>Project Video</h2>
          <ReactPlayer
            url="https://youtu.be/WkZTH5DtQfU"
            width="500px"
            height="600px"
          />
        </div>
      </div>
    </>
  );
};

export default About;
