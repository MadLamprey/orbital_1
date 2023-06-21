import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import logo from "./resources/logo_alt.png";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods && signInMethods.length > 0) {
        setError("User already exists");
        // Handle the case where the user is already registered
        // You can show an error message or navigate to a different page
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log(user);
        navigate("/home");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorCode, errorMessage);
    }
  };

  return (
    <div>
      <header class=".header">
        <img src={logo} class="logo" height="70px" alt="logo" />
      </header>
      <hr></hr>
      <div class="box-section">
        <div class="box">
          <div class="inner-box">
            <h1 class="box-heading">Register</h1>
          </div>
          <div class="form">
            <input
              class="text-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br></br>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              class="text-input"
            />
          </div>
          <button onClick={handleRegister} class="alt-button">
            Register
          </button>
          <br />
          {error && (
            <p>
              {error}
              <br></br>
              <Link to="/login" class="link-1">
                Log In instead
              </Link>
            </p>
          )}
          <br />
        </div>
      </div>
    </div>
  );
};

export default Register;
