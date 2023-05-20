import React, {useState, useEffect} from 'react';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import LandingPage from './LandingPage';
import About from './About'
import Team from './Team'
import Contact from './Contact'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import logo from './ScoreScope_logo.png'
import ZoomableImage from './ZoomableImage';
 
function App() {
 
  return (
    <Router>
      <div>
                                
            <Routes>
               <Route path='/' element={<LandingPage/>}/>
               <Route path='/register' element={<Register/>}/>
               <Route path='/home' element={<Home/>}/>
               <Route path='/login' element={<Login/>}/>
               <Route path='/about' element={<About/>}/>
               <Route path='/team' element={<Team/>}/>
               <Route path='/contact' element={<Contact/>}/>
            </Routes>
      </div>
    </Router>
  );
}
 
export default App;