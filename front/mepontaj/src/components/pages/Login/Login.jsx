import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { FaRegUserCircle} from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { useUser } from '../User/UserContext';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [email, setEmail] = useState('');
    const [parola, setPassword] = useState('');
    const navigate=useNavigate();
    const { user, setUser } = useUser();

    const handleLogin = async (e) => {
        // http://localhost:8090/api/angajati/login
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8090/api/angajati/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, parola }),
            });
            if (response.ok) {
                const { angajat, token } = await response.json();
                localStorage.setItem('token', token); 
                const decodedToken = jwtDecode(token); 
                setUser(decodedToken); 
                decodedToken.isAdmin ? navigate('/admin') : navigate('/user');  
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch(err) {
            console.error('Login error:', err);
        }
    }

    return (
        <div className={styles.loginContainer}>
        <div className={styles.wrapper}>
            <form action="">
            <h1>Login</h1>
            <div className={styles.inputBox}>
                <input type="email" placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)} />
                <FaRegUserCircle className={styles.icon} />
            </div>
            <div className={styles.inputBox}>
                 <input type="password" placeholder='Parola' required value={parola} onChange={e => setPassword(e.target.value)} />
                <IoMdLock  className={styles.icon}/>
            </div>
            <button className={styles.buton} type="submit" onClick={handleLogin}>Login</button>
            </form>
        </div>
    </div>
    )
}

export default Login;