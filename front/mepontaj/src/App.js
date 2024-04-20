import React, { useRef, useState  } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from './components/Admin';
import Login from './components/pages/Login/Login'
import User from './components/pages/User/User';
import { ColorModeContext, useMode } from "./theme";
import AdaugareAngajat from './components/pages/admin/angajati/adaugareAngajat';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //tema specifică

function App() {
  const [theme, colorMode] = useMode();
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/user" element={<User />} />
      <Route path="/admin/*" element={<Admin />} /> {/* Rutele de admin sunt acum sub-path-ul /admin */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;


