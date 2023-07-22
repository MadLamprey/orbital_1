import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaGithub } from "react-icons/fa";
import logo from "./resources/logo_alt.png";
import img1 from "./resources/WhatsApp Image 2023-05-14 at 12.25.50.jpg";
import img2 from "./resources/WhatsApp Image 2023-05-14 at 18.09.26.jpeg";

const Team = () => {
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
          <h2>Introducing the Team</h2>
        </div>
      </div>
      <div className="team-members">
        <div className="column" style={{ textAlign: "center", margin: "10px" }}>
          <img src={img1} className="pfp1" alt="Aditya Misra" />
          <figcaption>Aditya Misra</figcaption>
          <figcaption>Y1 CS Student</figcaption>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <a href="https://www.instagram.com/_adityamisra_/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} style={{ margin: "0 5px", color: "white" }} />
            </a>
            <a href="https://github.com/MadLamprey" target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} style={{ margin: "0 5px", color: "white" }} />
            </a>
          </div>
        </div>
        <div className="column" style={{ textAlign: "center", margin: "10px" }}>
          <img src={img2} className="pfp2" alt="Aarav Rawal" />
          <figcaption>Aarav Rawal</figcaption>
          <figcaption>Y1 Comp Engineering Student</figcaption>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <a href="https://www.instagram.com/aaravrawal_/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} style={{ margin: "0 5px", color: "white" }} />
            </a>
            <a href="https://github.com/aaravrawal" target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} style={{ margin: "0 5px", color: "white" }} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
