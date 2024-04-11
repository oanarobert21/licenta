import React, { useRef } from 'react';
import styles from './Login.module.css';
import { FaRegUserCircle} from "react-icons/fa";
import { IoMdLock } from "react-icons/io";


const Login = () => {
    return (
        <div className={styles.wrapper}>
            <form action="">
            <h1>Login</h1>
            <div className={styles.inputBox}>
                <input type="email" placeholder='Email' required></input>
                <FaRegUserCircle className={styles.icon} />
            </div>
            <div className={styles.inputBox}>
                <input type="password" placeholder='Parola' required></input>
                <IoMdLock  className={styles.icon}/>
            </div>
            <button className={styles.buton} type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;