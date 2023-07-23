import React, { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import googleLogo from "./resources/google_logo.png";
import githubLogo from "./resources/github_logo.png";
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
        auth.updateCurrentUser(userCredential);
        navigate("/home");
        setLoginStatus("Logged in successfully");
      })
      .catch((error) => {
        setLoginStatus("Your Email or Password is incorrect, please try again");
      });
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log(user);
      navigate("/home");
    } catch (error) {}
  };

  const handleLoginWithGitHub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log(user);
      navigate("/home");
    } catch (error) {}
  };

  return (
    <main>
      <header class=".header">
        <img src={logo} class="logo" height="70px" alt="logo" />
      </header>
      <hr />
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
            <br />
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
          <br />
          <button onClick={handleLoginWithGoogle} className="logo-button">
            <img src={googleLogo} alt="Google" className="logo-image" />
          </button>
          <button onClick={handleLoginWithGitHub} className="logo-button">
            <img src={githubLogo} className="logo-image" alt="GitHub" />
          </button>
          <p>{loginStatus}</p>
        </div>
      </div>
    </main>
  );
};

export default Login;
