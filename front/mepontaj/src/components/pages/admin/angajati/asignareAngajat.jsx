import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const AsignareAngajat = () => {
    const [angajati, setAngajati] = useState([]);
    const [santiere, setSantiere] = useState([]);
    const [selectedAngajat, setSelectedAngajat] = useState(null);
    const [selectedSantiere, setSelectedSantiere] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        fetchAngajati();
        fetchSantiere();
    }, []); // The empty array ensures these functions are called only once when the component mounts

    async function fetchAngajati() {
        try {
            const response = await fetch('http://localhost:8090/api/angajati/getAllAngajati');
            if (!response.ok) {
                throw new Error('Failed to fetch angajati');
            }
            const data = await response.json();
            const formattedAngajati = data.map(angajat => ({
                label: `${angajat.nume} ${angajat.prenume}`,
                value: angajat.id 
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

    const save = () => {
        // Implement the save logic here
        // You might want to send 'selectedAngajat' and 'selectedSantiere' to your backend
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Date salvate' });
    };

    return (
        <div className="content">
            <Box m="20px">
                <Header title="Asignare angajati" subtitle="Asignare angajati" />
            </Box>
            <div className="form">
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
