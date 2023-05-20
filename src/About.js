import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './ScoreScope_logo.png';
import Box from '@mui/material/Box';
import poster from './5456.png';
import vid from './5456.mp4';
import ReactPlayer from 'react-player';


const About = () => {
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
        <li><Link to='/home'><button class='button_1'>Home</button></Link></li>
        <li><Link to='/team'><button class='button_1'>The Team</button></Link></li>
        <li><Link to='/contact'><button class='button_1'>Contact Us</button></Link></li>
      </ul>
    </div> 
    <hr></hr>
    <h2>About ScoreScope</h2>
    <div>
    <Box 
     sx={{
      height: '300px',
      backgroundColor: 'black',
      border: '10px dashed grey',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      fontSize: 'x-large',
      color: 'pink'
    }}>ScoreScope is a text classification program that aims to analyse past papers for particular modules. Based on a simple text analyser, it studies the questions on the past papers and returns what topics have been tested on most frequently. This enables students who make use of this program to be able to narrow down their syllabus to only a few topics that they can revise in the time leading up to the exam. </Box></div>
    <br></br>
    <div>
      <div class='column'>
      <h2>Project Poster</h2>
      <img src={ poster } class='image'/>
      </div>
      <div class='column'>
        <h2>Project Video</h2>
        <ReactPlayer url='https://youtu.be/WkZTH5DtQfU' style={{ marginLeft:'120px'}} width='500px' height='600px'/>
      </div>
    </div>
    </>
    )
}

export default About