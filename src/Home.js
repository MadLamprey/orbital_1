import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './ScoreScope_logo.png'

const Home = () => {
    const navigate = useNavigate();

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
        </>
    )
}

export default Home