import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import Header from "../Header";
import React, { useState, useEffect, useRef} from 'react';
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
    const dt = useRef(null);
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

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, employees);
                doc.save('angajati.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const filteredData = employees.map(employee => {
                return exportColumns.reduce((acc, col) => {
                    acc[col.dataKey] = employee[col.dataKey];
                    return acc;
                }, {});
            });
            const worksheet = xlsx.utils.json_to_sheet(filteredData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'angajati');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const exportColumns = [
        { title: 'Nume', dataKey: 'nume' },
        { title: 'Prenume', dataKey: 'prenume' },
        { title: 'CNP', dataKey: 'cnp' },
        { title: 'Data angajarii', dataKey: 'dataAngajare' },
        { title: 'Numar telefon', dataKey: 'numarTelefon' },
        { title: 'Email', dataKey: 'email' }
    ];

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return (
        <Box m="20px">
            <Header title="Angajați" subtitle="Vizualizare angajați" />
            <DataTable ref={dt} value={employees} paginator rows={10} 
                globalFilter={globalFilter} responsiveLayout="scroll"
                selectionMode="single" onRowSelect={onRowSelect} header={header}>
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