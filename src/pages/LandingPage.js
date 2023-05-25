import React, { useState } from 'react';
import { NavLink, Link} from 'react-router-dom';
import logo from './resources/ScoreScope_logo.png'

const LandingPage = () => {
    return (
        <div>
            <header class='.header'>
          <img src= {logo}/>
          </header> 
          <hr></hr>
            <div>
                <h2>Welcome to ScoreScope</h2>
                <h2>Register or Login to continue</h2>
            </div>
            <div>
            <Link to='/register'>
                <button class='my-button'>Register</button>
            </Link>
            <Link to='/login'>
                <button class='my-button'>Login</button>
            </Link>
            </div>
        </div>
    )
}

export default LandingPage