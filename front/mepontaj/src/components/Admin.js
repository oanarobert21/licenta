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
import Concedii from './pages/admin/concedii/concedii';
import Santier from './pages/admin/santiere/santier';
import Pontaje from './pages/admin/pontaje/pontaje';
import StatisticiPontaje from './pages/admin/grafice/statisticiPontaje';

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
              <Route path="concedii" element={<Concedii />} />
              <Route path="santiere" element={<Santier />} />
              <Route path="pontaje" element={<Pontaje />} />
              <Route path="statistici/pontaje" element={<StatisticiPontaje />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Admin;
