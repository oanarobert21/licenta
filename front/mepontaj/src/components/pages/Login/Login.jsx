import React, { useRef } from 'react';
import './Login.css'
import { FaRegUserCircle} from "react-icons/fa";
import { IoMdLock } from "react-icons/io";


const Login = () => {
    return (
        <div className="wrapper">
            <form action="">
            <h1>Login</h1>
            <div className="input-box">
                <input type="email" placeholder='Email' required></input>
                <FaRegUserCircle className="icon" />
            </div>
            <div className="input-box">
                <input type="password" placeholder='Parola' required></input>
                <IoMdLock  className="icon"/>
            </div>
            <button className="buton" type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login