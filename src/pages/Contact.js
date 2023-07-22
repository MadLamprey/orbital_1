import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./resources/logo_alt.png";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "emailjs-com";

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

      setSendStatus("Message sent successfully!");
      await sendEmailCopy(); // Send email copy to the user

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setSendStatus("Error sending message: " + error);
    }
  };

  const sendEmailCopy = async () => {
    try {
      const templateParams = {
        to_email: email,
        from_name: "ScoreScope",
        message_body: message,
      };

      await emailjs.send(
        "service_3xymeno",
        "template_dmhj8tj",
        templateParams,
        "8pcuQcfo4-Jz8osV9"
      );

      console.log("Email sent to user!");
    } catch (error) {
      console.error("Error sending email to user:", error);
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
      <hr />
      <div class="box-section">
        <div class="box_1" style={{ height: "100%", resize: "vertical" }}>
          <div class="inner-box">
            <h2 class="box-heading">Contact Us</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <br />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                class="text-input"
              />
            </div>
            <br />
            <div>
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                class="text-input"
              />
            </div>
            <br />
            <div>
              <label htmlFor="message">Message</label>
              <br />
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                class="text-input"
                style={{ height: "100%", resize: "vertical" }}
              />
            </div>
            <br />
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
