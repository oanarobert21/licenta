import React, { useState , useRef } from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const AsignareAngajat = () => {

    const [angajat, setSelectedAngajat] = useState(null);
    const [santiere, setSelectedSantiere] = useState(null);
    const angajati = [
        { name: 'Robert'},
        { name: 'Cosmin'},
        { name: 'Maria'},
        { name: 'Ana'},
        { name: 'Stefan'},
        { name: 'Diana'}
    ];
    const santier = [
        { name: 'Buzau'},
        { name: 'Bucuresti'},
        { name: 'Posta Calnau'},
        { name: 'Boldu'},
        { name: 'Ploiesti'}
    ];
    const toast = useRef(null);
    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Date salvate' });
    };

    return(
        <div className="content">
        <Box m="20px">
            <Header title="Asignare angajati" subtitle="Asignare angajati" />
        </Box>
        <div className="form">
        <Dropdown value={angajat} onChange={(e) => setSelectedAngajat(e.value)} options={angajati} optionLabel="name" placeholder="Selectează un angajat" 
                filter className="w:1rem md:w-20rem" />
        <MultiSelect value={santiere} onChange={(e) => setSelectedSantiere(e.value)} options={santier} optionLabel="name" 
                filter placeholder="Selectează un șantier" maxSelectedLabels={3} className="w-full md:w-20rem" />
        <Toast ref={toast}></Toast>
            <Button label="Salvare" onClick={save} className="w:1rem md:w-20rem"/>
        </div>
        </div>
    );
}

export default AsignareAngajat;