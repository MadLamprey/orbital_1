import React from "react";
import { Link } from "react-router-dom";
import logo from "./resources/logo_alt.png";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendStatus, setSendStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const contactRef = collection(db, "contacts");
      await addDoc(contactRef, {
        name,
        email,
        message,
      });

      setName("");
      setEmail("");
      setMessage("");
      setSendStatus("Message sent successfully!");
    } catch (error) {
      setSendStatus("Error sending message:" + error);
    }
  };

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
      <hr></hr>
      <div class="box-section">
        <div class="box_1">
          <div class="inner-box">
          <h2 class="box-heading">Contact Us</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <br></br>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                class="text-input"
              />
            </div>
            <br></br>
            <div>
              <label htmlFor="email">Email</label>
              <br></br>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                class="text-input"
              />
            </div>
            <br></br>
            <div>
              <label htmlFor="message">Message</label>
              <br></br>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                class="text-input"
              />
            </div>
            <br></br>
            <button type="submit" class="my-button">
              Submit
            </button>
            <p>{sendStatus}</p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
