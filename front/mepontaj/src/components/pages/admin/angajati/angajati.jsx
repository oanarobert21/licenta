import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import Header from "../Header";
import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import '../admin.css';

const Angajati = () => {
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const handleCNPChange = (e) => {
        const input = e.target.value;
        if (input === '' || (input.length <= 13 && /^[0-9\b]+$/.test(input))) {
            setEmployee({...employee, cnp: input});
        }
    };


    const fetchEmployees = async () => {
        const response = await fetch('http://localhost:8090/api/angajati/getAllAngajati');
        if (response.ok) {
            const data = await response.json();
            setEmployees(data);
        } else {
            console.error('Failed to fetch employees');
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const onRowSelect = (event) => {
        setEmployee(event.data);
        setDisplayDialog(true);
    };

    const handleInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _employee = {...employee};
        _employee[`${name}`] = val;
        setEmployee(_employee);
    };

    const saveEmployee = async () => {
        const response = await fetch('http://localhost:8090/api/angajati/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });
        if (response.ok) {
            setDisplayDialog(false);
            fetchEmployees(); 
        }
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Save" icon="pi pi-check" onClick={saveEmployee} />
            <Button label="Cancel" icon="pi pi-times" onClick={() => setDisplayDialog(false)} />
        </React.Fragment>
    );

    return (
        <Box m="20px">
            <Header title="Angajați" subtitle="Vizualizare angajați" />
            <DataTable value={employees} paginator rows={10} 
                globalFilter={globalFilter} responsiveLayout="scroll"
                selectionMode="single" onRowSelect={onRowSelect}>
                <Column field="nume" header="Nume" sortable filter filterPlaceholder="Search" style={{ width: '25%' }} />
                <Column field="prenume" header="Prenume" />
                <Column field="cnp" header="CNP" />
                <Column field="dataAngajare" header="Data Angajare" />
                <Column field="numarTelefon" header="Număr Telefon" />
                <Column field="email" header="Email" />
            </DataTable>

            {employee && (
                <Dialog visible={displayDialog} style={{ width: '450px' }} header="Modificare date angajat" modal footer={dialogFooter} onHide={() => setDisplayDialog(false)}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="nume">Nume</label>
                            <InputText id="nume" value={employee.nume} onChange={(e) => handleInputChange(e, 'nume')} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="prenume">Prenume</label>
                            <InputText id="prenume" value={employee.prenume} onChange={(e) => handleInputChange(e, 'prenume')} />
                        </div>
                        <div className="p-field">
                             <label htmlFor="cnp">CNP</label>
                             <InputText id="cnp" value={employee.cnp} onChange={handleCNPChange} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="dataAngajare">Data angajare</label>
                            <InputText id="cnp" value={employee.dataAngajare} onChange={(e) => handleInputChange(e, 'dataAngajare')} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="dataAngajare">Numar telefon</label>
                            <InputText id="numarTelefon" value={employee.numarTelefon} onChange={(e) => handleInputChange(e, 'numarTelefon')} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={employee.email} onChange={(e) => handleInputChange(e, 'email')} />
                        </div>
                    </div>
                </Dialog>
            )}
        </Box>
    );
};

export default Angajati;