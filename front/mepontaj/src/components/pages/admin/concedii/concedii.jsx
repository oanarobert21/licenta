import React, {useState, useEffect}from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

const Concedii = () => {

    const[concedii, setConcedii] = useState([]);

    const fetchConcedii = async () => {
        const response = await fetch('http://localhost:8090/api/concedii/getAllConcedii');
        if(response.ok){
            const data = await response.json();
            const dataServer = data.map(concediu => ({
                ...concediu,
                nume: concediu.Angajati.nume,
                prenume: concediu.Angajati.prenume
            }));
            setConcedii(dataServer);
        } else {
            console.error('Failed to fetch concedii');
        }
    }

    const acceptaConcediu = async(id)=>{
        try{
            const response = await fetch(`http://localhost:8090/api/concedii/updateConcediu/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status: 'Acceptat'}),
            });
            if(response.ok){
                fetchConcedii();
            } else {
                console.error('Eroare la concediu');
            }
        }catch(err){
            console.error('Eroare:', err);
        }
    }

    const respingeConcediu = async(id)=>{
        try{
            const response = await fetch(`http://localhost:8090/api/concedii/updateConcediu/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status: 'Respins'}),
            });
            if(response.ok){
                fetchConcedii();
            } else {
                console.error('Eroare la concediu');
            }
        }catch(err){
            console.error('Eroare:', err);
        }
    }

    useEffect(() => {
        fetchConcedii();
    },[]);

    const buttons = (rowData) => {
        return(
            <div>
                <Button icon="pi pi-check" rounded severity="success" aria-label="Filter" style={{ marginRight: '3px' }} onClick={()=>acceptaConcediu(rowData.id)}/>
                <Button icon="pi pi-times" rounded severity="danger" aria-label="Cancel" onClick={()=>respingeConcediu(rowData.id)} />
            </div>
        )
    }

    return(
        <div className="content">
        <Box m="20px">
            <Header title="Concedii" subtitle="Vizualizează cererile de concedii" />
            <DataTable value={concedii} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="nume" header="Nume"/>
            <Column field="prenume" header="Prenume"/>
            <Column field="tipConcediu" header="Tip Concediu"/>
            <Column field="dataInceput" header="Data Inceput" dateFormat="dd/mm/yy"/>
            <Column field="dataSfarsit" header="Data Sfarsit"/>
            <Column field="motiv" header="Motiv"/>
            <Column field="status" header="Status"/> 
            <Column body={buttons} header="Răspuns"/>
            </DataTable>
        </Box>
        </div>
    );
}

export default Concedii;