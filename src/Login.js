import React, {useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from './firebase';
import { NavLink, Link, useNavigate } from 'react-router-dom'
import logo from './ScoreScope_logo.png'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      navigate("/home")
      setLoginStatus('Logged in successfully');
    })
    .catch ((error) => {
      setLoginStatus('Your Email or Password is incorrect, please try again');
    });
  }

  return (
    <main>
      <header class='.header'>
          <img src= {logo}/>
          </header> 
          <hr></hr>
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        class='text-input'
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        class='text-input'
      />
      <br>
      </br>
      <br></br>
      <button onClick={handleLogin} class='my-button'>Login</button>
      <div></div>
      <p>{loginStatus}</p>
    </div>
    </main>
  );
};

export default Login;
