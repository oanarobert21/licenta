import React, { useEffect, useState  } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from './components/Admin';
import Login from './components/pages/Login/Login'
import User from './components/pages/User/User';
import { ColorModeContext, useMode } from "./theme";
import AdaugareAngajat from './components/pages/admin/angajati/adaugareAngajat';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import { UserProvider } from './components/pages/User/UserContext';
import ProtectedRoute from './components/pages/Login/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
        <Route path="/" element={<Login />} />
      <Route path="/user" element={<ProtectedRoute allowedFor="user"><User /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute allowedFor="admin"><Admin /></ProtectedRoute>} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;


