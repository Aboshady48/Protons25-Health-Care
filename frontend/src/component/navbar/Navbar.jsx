import React from 'react'
import './Navbar.css'
import eira_logo from '../../../assets/eira_logo.jpeg'

const Navbar = () => {
  return (
    <div className='navbar'>

        <img src={eira_logo} alt="" className='logo' style={{width:"180px", height:"90px" , display:"block",objectFit:"contain"}}/>

         <ul className="sidebar">
            <li><a href="#">About</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Streak</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Ask</a></li>
        </ul>
        <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Streak</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Ask</a></li>
        </ul>
    
    </div>
  ) 
}

export default Navbar