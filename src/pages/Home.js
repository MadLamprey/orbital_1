import React from 'react';
import { useState, useEffect } from'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './resources/ScoreScope_logo.png'
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('')
    const [prediction, setPrediction] = useState('')
    const [accuracy, setAccuracy] = useState(null)

    useEffect(() => {
      fetchAccuracy();
    }, []);
  
    const fetchAccuracy = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/predict');
        setAccuracy(response.data.accuracy);
      } catch (error) {
        console.error(error);
      }
    };

    const handlePrediction = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', { question });
        const prediction = response.data.prediction;
        setPrediction(prediction);
      } catch (error) {
        console.error('Error:', error);
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
          <div>
            <p>Enter Question</p>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className='text-input'/>
      <button onClick={handlePrediction} class='my-button'>Predict</button>
      {accuracy && <p>Accuracy: {accuracy}{fetchAccuracy}</p>}
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
        </>
    )
}

export default Home
