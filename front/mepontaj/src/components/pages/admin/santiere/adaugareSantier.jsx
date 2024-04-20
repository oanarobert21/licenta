import React, { useState } from 'react';
import '../admin.css';
import { Box } from '@mui/material';
import Header from '../Header';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import '../angajati/adaugareAngajati.css';

const AdaugareSantier = () => {

    const [nume, setNume] = useState('');
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');
    const [raza, setRaza] = useState('');
    const [localitate, setLocalitate] = useState('');
    const [judet, setJudet] = useState('');
    const [adresa, setAdresa] = useState('');

    const [loading, setLoading] = useState(false);

    const load = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="content">
            <Box m="20px">
                <Header title="Adaugare șantiere" subtitle="Adaugare șantiere" />
            </Box>
            <div className="form">
                <FloatLabel className="p-float-label">
                    <InputText id="nume" value={nume} onChange={(e) => setNume(e.target.value)} />
                    <label htmlFor="nume">Nume</label>
                </FloatLabel>
                <FloatLabel className="p-float-label">
                    <InputText id="lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                    <label htmlFor="lat">Latitudine</label>
                </FloatLabel>
                <FloatLabel className="p-float-label">
                    <InputText id="long" value={long} onChange={(e) => setLong(e.target.value)} />
                    <label htmlFor="long">Longitudine</label>
                </FloatLabel>
                <FloatLabel className="p-float-label">
                    <InputText id="raza" value={raza} onChange={(e) => setRaza(e.target.value)} />
                    <label htmlFor="raza">Raza</label>
                </FloatLabel>
                <FloatLabel className="p-float-label">
                    <InputText id="localitate" value={localitate} onChange={(e) => setLocalitate(e.target.value)} />
                    <label htmlFor="localitate">Localitate</label>
                </FloatLabel>
                <FloatLabel className="p-float-label">
                    <InputText id="judet" value={judet} onChange={(e) => setJudet(e.target.value)} />
                    <label htmlFor="judet">Judet</label>
                </FloatLabel>
                <FloatLabel className="p-float-label">
                    <InputText id="adresa"  value={adresa} onChange={(e) => setAdresa(e.target.value)} />
                    <label htmlFor="adresa">Adresa</label>
                </FloatLabel>
            </div>
            <div className="btn">
            <Button id="btnB" label="Submit" icon="pi pi-check" loading={loading} onClick={load} />
            </div>

        </div>
    );
}
 export default AdaugareSantier;