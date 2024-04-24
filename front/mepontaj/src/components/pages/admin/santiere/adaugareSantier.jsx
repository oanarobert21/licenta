import React, { useState, useRef } from 'react';
import '../admin.css';
import { Box } from '@mui/material';
import Header from '../Header';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../angajati/adaugareAngajati.css';

const AdaugareSantier = () => {
    const [nume, setNume] = useState('');
    const [latitudine, setLat] = useState('');
    const [longitudine, setLong] = useState('');
    const [raza, setRaza] = useState('');
    const [localitate, setLocalitate] = useState('');
    const [judet, setJudet] = useState('');
    const [adresa, setAdresa] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const load = () => {
        setLoading(true);
        const data = { nume, latitudine, longitudine, raza, localitate, judet, adresa };
        fetch('http://localhost:8090/api/santiere/addSantier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw (errData.message || errData.errors);
                });
            }
            return response.json();
        })
        .then(data => {
            toast.current.show({ severity: 'success', summary: 'Adaugat', detail: 'Santier adaugat cu succes!' });
            setLoading(false);
        })
        .catch(errors => {
            console.error('Error:', errors);
            let detailMessage;
            if (Array.isArray(errors)) {
                detailMessage = errors.join(", "); 
            } else {
                detailMessage = errors; 
            }
            toast.current.show({ severity: 'error', summary: 'Eroare', detail: detailMessage });
            setLoading(false);
        });
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
                    <InputText id="lat" value={latitudine} onChange={(e) => setLat(e.target.value)} />
                    <label htmlFor="lat">Latitudine</label>
                </FloatLabel>
                <FloatLabel className="p-float-label">
                    <InputText id="long" value={longitudine} onChange={(e) => setLong(e.target.value)} />
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
            <Toast ref={toast} />
        </div>
    );
}
 export default AdaugareSantier;