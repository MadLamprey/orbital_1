import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import logo from "./resources/logo_alt.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/home");
        setLoginStatus("Logged in successfully");
      })
      .catch((error) => {
        setLoginStatus("Your Email or Password is incorrect, please try again");
      });
  };

  return (
    <main>
      <header class=".header">
        <img src={logo} class="logo" height="70px" alt="logo" />
      </header>
      <hr></hr>
      <div class="box-section">
        <div class="box">
          <div class="inner-box">
            <h1 class="box-heading">Login</h1>
          </div>
          <div class="form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="text-input"
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
          <button onClick={handleLogin} class="alt-button">
            Login
          </button>
          <p>{loginStatus}</p>
        </div>
      </div>
    </main>
  );
};

export default Login;
