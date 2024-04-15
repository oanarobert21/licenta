import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/pages/Login/Login'
import User from './components/pages/User/User';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
