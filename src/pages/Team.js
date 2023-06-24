import React from "react";
import { Link } from "react-router-dom";
import logo from "./resources/logo_alt.png";
import img1 from "./resources/WhatsApp Image 2023-05-14 at 12.25.50.jpg";
import img2 from "./resources/WhatsApp Image 2023-05-14 at 18.09.26.jpeg";
import InstagramIcon from "@mui/icons-material/Instagram";

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

      <br />
      <div>
        <div class="column">
          <img src={img1} class="pfp1" alt="Aditya Misra" />
          <figcaption style={{ marginLeft: "200px" }}>Aditya Misra</figcaption>
          <figcaption style={{ marginLeft: "200px" }}>Y1 CS Student</figcaption>
          <figcaption style={{ marginLeft: "200px" }}>
            {InstagramIcon}
          </figcaption>
        </div>
        <div class="column">
          <img src={img2} class="pfp2" alt="Aarav Rawal" />
          <figcaption style={{ marginRight: "200px" }}>Aarav Rawal</figcaption>
          <figcaption style={{ marginRight: "200px" }}>
            Y1 Comp Engineering Student
          </figcaption>
        </div>
      </div>
    </>
  );
};

export default Team;
