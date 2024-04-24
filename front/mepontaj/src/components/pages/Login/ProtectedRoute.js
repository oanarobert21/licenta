import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedFor }) => {
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : {};
    const isAdmin = decoded.isAdmin;  

    if (allowedFor === 'admin' && !isAdmin) {
        return <Navigate to="/" replace />;
    } else if (allowedFor === 'user' && isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
