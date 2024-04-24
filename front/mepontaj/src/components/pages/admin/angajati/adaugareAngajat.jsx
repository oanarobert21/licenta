import React, { useState, useRef} from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { Toast } from 'primereact/toast';
import { Box } from '@mui/material';
import Header from '../Header';
import './adaugareAngajati.css'; 

const AdaugareAngajat = () => {
    const [nume, setNume] = useState('');
    const [prenume, setPrenume] = useState('');
    const [cnp, setCNP] = useState('');
    const [dataAngajare, setDataAngajare] = useState('');
    const [numarTelefon, setNumarTelefon] = useState('');
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const handleCNPChange = (e) => {
        const input = e.target.value;
        if (input === '' || (input.length <= 13 && /^[0-9\b]+$/.test(input))) {
            setCNP(input);
        }
    };

    const load = () => {
        //setLoading(true);
        const data = { nume, prenume, cnp, dataAngajare, numarTelefon, email, parola };
        fetch('http://localhost:8090/api/angajati/addAngajat', {
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
            toast.current.show({ severity: 'success', summary: 'Adaugat', detail: 'Angajat adaugat cu succes!' });
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
        <div className="app">
            <div className="content">
                <Box m="20px">
                    <Header title="Adaugare angajati" subtitle="Adaugare angajati" />
                </Box>
                <div className="form">
                    <FloatLabel className="p-float-label">
                        <InputText id="nume" value={nume} onChange={(e) => setNume(e.target.value)} />
                        <label htmlFor="nume">Nume</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="prenume" value={prenume} onChange={(e) => setPrenume(e.target.value)} />
                        <label htmlFor="prenume">Prenume</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="CNP" value={cnp} onChange={handleCNPChange} />
                        <label htmlFor="CNP">CNP</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <Calendar id="date" value={dataAngajare} onChange={(e) => setDataAngajare(e.target.value)} />
                        <label htmlFor="date">Data angajare</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="nrTel" value={numarTelefon} onChange={(e) => setNumarTelefon(e.target.value)} />
                        <label htmlFor="phone">Număr telefon</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <Password id="password" value={parola} onChange={(e) => setParola(e.target.value)} />
                        <label id="password">Parola</label>
                    </FloatLabel>
                </div>
                <div className="btn">
                    <Button id="btnB" label="Submit" icon="pi pi-check" loading={loading} onClick={load} />
                </div>
                <Toast ref={toast} />
            </div>
        </div>
    );
}

export default AdaugareAngajat;
