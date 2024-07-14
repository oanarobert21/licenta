import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../angajati/angajati.css';


const AsignareAngajat = () => {
    const [angajati, setAngajati] = useState([]);
    const [santiere, setSantiere] = useState([]);
    const [selectedAngajat, setSelectedAngajat] = useState(null);
    const [selectedSantiere, setSelectedSantiere] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        fetchAngajati();
        fetchSantiere();
    }, []); 

    async function fetchAngajati() {
        try {
            const response = await fetch('http://localhost:8090/api/angajati/getAllAngajati');
            if (!response.ok) {
                throw new Error('Failed to fetch angajati');
            }
            const data = await response.json();
            const formattedAngajati = data.map(angajat => ({
                label: `${angajat.nume} ${angajat.prenume}`,
                value: angajat.idAngajat 
            }));
            setAngajati(formattedAngajati);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Fetching Error', detail: error.message });
            console.error('Error:', error);
        }
    }

    async function fetchSantiere() {
        try {
            const response = await fetch('http://localhost:8090/api/santiere/getAllSantiere');
            if (!response.ok) {
                throw new Error('Failed to fetch santiere');
            }
            const data = await response.json();
            const formattedSantiere = data.map(santier => ({
                label: santier.nume,
                value: santier.id
            }));
            setSantiere(formattedSantiere);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Fetching Error', detail: error.message });
            console.error('Error:', error);
        }
    }

    const save = async () => {
        if (!selectedAngajat || selectedSantiere.length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Te rog selectează un angajat și cel puțin un șantier.' });
            return;
        }
        try {
            const response = await fetch('http://localhost:8090/api/santiere/asignareSantier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idAngajat: selectedAngajat,
                    idSantiere: selectedSantiere
                })
            });

            if (!response.ok) {
                throw new Error('Angajatul este deja asignat la acest santier!');
            }
            await response.json(); 
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Datele au fost salvate cu succes!' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Eroare', detail: error.message });
            console.error('Error:', error);
        }
        console.log("Trimite la backend:", { idAngajat: selectedAngajat, idSantiere: selectedSantiere });
    };
    

    return (
        <div className="content">
            <Box m="20px">
                <Header title="Asignare angajati" subtitle="Asignare angajati" />
            </Box>
            <div className="formularAsignare">
                <Dropdown value={selectedAngajat} options={angajati} onChange={(e) => setSelectedAngajat(e.value)}
                    optionLabel="label" placeholder="Selectează un angajat" filter />
                <MultiSelect value={selectedSantiere} options={santiere} onChange={(e) => setSelectedSantiere(e.value)}
                    optionLabel="label" placeholder="Selectează un șantier" maxSelectedLabels={3} />
                <Toast ref={toast} />
                <Button label="Salvare" onClick={save} />
            </div>
        </div>
    );
}

export default AsignareAngajat;
