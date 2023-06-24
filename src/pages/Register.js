import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import logo from "./resources/logo_alt.png";
import googleLogo from "./resources/google_logo.png";
import githubLogo from "./resources/github_logo.png";

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

  const handleRegisterWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log(user);
      navigate("/home");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorCode, errorMessage);
    }
  };

  const handleRegisterWithGitHub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log(user);
      navigate("/home");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorCode, errorMessage);
    }
  };

  return (
    <div>
      <header className="header">
        <img src={logo} className="logo" height="70px" alt="logo" />
      </header>
      <hr />
      <div className="box-section">
        <div className="box">
          <div className="inner-box">
            <h1 className="box-heading">Register</h1>
          </div>
          <div className="form">
            <input
              className="text-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input"
            />
          </div>
          <button onClick={handleRegister} className="alt-button">
            Register
          </button>
          <br />
          <button onClick={handleRegisterWithGoogle} className="logo-button">
            <img src={googleLogo} alt="Google" className="logo-image" />
          </button>
          <button onClick={handleRegisterWithGitHub} className="logo-button">
            <img src={githubLogo} className="logo-image" alt="GitHub" />
          </button>
          <br />
          {error && (
            <p>
              {error}
              <br />
              <Link to="/login" className="link-1">
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
