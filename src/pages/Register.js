import React, { useState } from 'react';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from './resources/ScoreScope_logo.png'

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate('/home')
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
    });

  }

  return (
  <div>
    <header class='.header'>
          <img src= {logo}/>
          </header> 
          <hr></hr>
    <body>
      <h2>Register</h2>
      <input
      class='text-input'
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        class='text-input'
      />
      <br></br>
      <br></br>
      <br></br>
      <button onClick={handleRegister} class='my-button'>Register</button>
      <div></div>
      </body>
    </div>
  );
}
 
export default Register