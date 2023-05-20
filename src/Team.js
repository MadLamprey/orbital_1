import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './ScoreScope_logo.png'
import img1 from './WhatsApp Image 2023-05-14 at 12.25.50.jpg';
import img2 from './WhatsApp Image 2023-05-14 at 18.09.26.jpeg';

const Team = () => {
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
    <h2>Introducing the Team</h2>
    <br></br>
    <div>
    <div class='column'>
        <img src={ img1 } class='pfp1'/>
        <figcaption style={{ marginLeft:'200px'}}>Aditya Misra</figcaption>
        <figcaption style={{ marginLeft:'200px'}}>Y1 CS Student</figcaption>
    </div>
    <div class='column'>
        <img src={ img2 } class='pfp2'/>
        <figcaption style={{ marginRight:'200px'}}>Aarav Rawal</figcaption>
        <figcaption style={{ marginRight:'200px'}}>Y1 Comp Engineering Student</figcaption>
    </div>
    </div>
        </>
    )
}

export default Team