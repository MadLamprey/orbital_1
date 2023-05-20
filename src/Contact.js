import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './ScoreScope_logo.png';
import firebase from './firebase';
import { collection, addDoc} from 'firebase/firestore';
import { useState } from 'react';
import { db } from './firebase'

const Contact = () => {
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendStatus, setSendStatus] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const contactRef = collection(db, 'contacts');
      await addDoc(contactRef, {
        name,
        email,
        message,
      });

      setName('');
      setEmail('');
      setMessage('');
      setSendStatus('Message sent successfully!');
    } catch (error) {
      setSendStatus('Error sending message:'+ error);
    }
  };

    return(
        <>
        <div className="menu-bar">
      <div className="logo">
        <Link to='/home'>
        <img src= {logo} />
        </Link>
      </div>
      <ul className="menu-items">
        <li><Link to='/about'><button class='button_1'>About</button></Link></li>
        <li><Link to='/team'><button class='button_1'>The Team</button></Link></li>
        <li><Link to='/contact'><button class='button_1'>Contact Us</button></Link></li>
      </ul>
    </div> 
          <hr></hr>
          <h2>Contact Us</h2>
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
          class='text-input'
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
          class='text-input'
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
          class='text-input'
        />
      </div>
      <br></br>
      <button type="submit" class='my-button'>Submit</button>
      <p>{ sendStatus }</p>
    </form>
        </>
    );
}

export default Contact