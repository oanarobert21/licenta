import React from 'react';
import { Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from './pages/admin/global/Topbar';
import Sidebar from './pages/admin/global/Sidebar';
import Dashboard from './pages/admin/dashboard/index';
import Angajati from './pages/admin/angajati/angajati';
import AdaugareAngajat from './pages/admin/angajati/adaugareAngajat';
import AdaugareSantier from './pages/admin/santiere/adaugareSantier';
import AsignareAngajat from './pages/admin/angajati/asignareAngajat';

function Admin() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="angajati" element={<Angajati />} />
              <Route path="adaugare-angajat" element={<AdaugareAngajat />} />
              <Route path="adaugare-santier" element={<AdaugareSantier />} />
              <Route path="asignare-angajat" element={<AsignareAngajat />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Admin;
