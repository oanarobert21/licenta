import React, {useState, useEffect, useRef} from "react";
import Header from "../Header";
import { Box } from "@mui/material";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Santier =() => {
    const [santiere, setSantiere] = useState([]);
    const [santier, setSantier] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const dt = useRef(null);

    const fetchSantiere = async () => {
        const response = await fetch('http://localhost:8090/api/santiere/getAllSantiere');
        if(response.ok){
            const data = await response.json();
            setSantiere(data);
        } else {
            console.error('Failed to fetch santiere');
        }
    }

    useEffect(() => {
        fetchSantiere();
    }, []);

    const onRowSelect = (event) => {
        setSantier(event.data);
        setDisplayDialog(true);
    };

    const handleInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _santier = {...santier};
        _santier[`${name}`] = val;
        setSantier(_santier);
    };

    const saveSantier = async () => {
        const response = await fetch('http://localhost:8090/api/santiere/updateSantier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(santier),
        });
        if(response.ok){
            setDisplayDialog(false);
            fetchSantiere();
        } else {
            console.error('Eroare la santier');
        }
    }

    const dialogFooter = (
        <React.Fragment>
            <Button label="Save" icon="pi pi-check" onClick={saveSantier} />
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
                doc.autoTable(exportColumns, santiere);
                doc.save('santiere.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(santiere);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'santiere');
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
        { title: 'Latitudine', dataKey: 'latitudine' },
        { title: 'Longitudine', dataKey: 'longitudine' },
        { title: 'Localitate', dataKey: 'localitate' },
        { title: 'Judet', dataKey: 'judet' },
        { title: 'Adresa', dataKey: 'adresa' }
    ];

    const header = (
        <div className="flex align-items-center justify-content-end gap-1">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return(
        <Box m="20px">
        <Header title="Santiere" subtitle="Vizualizare santiere" />
        <DataTable ref={dt} value={santiere} paginator rows={10} 
            globalFilter={globalFilter} responsiveLayout="scroll"
            selectionMode="single" onRowSelect={onRowSelect} header={header}>
            <Column field="nume" header="Nume" sortable filter filterPlaceholder="Search" style={{ width: '25%' }} />
            <Column field="latitudine" header="Latitudine" />
            <Column field="longitudine" header="Longitudine" />
            <Column field="localitate" header="Localitate" />
            <Column field="judet" header="Judet" />
            <Column field="adresa" header="Adresa" />
        </DataTable>

        {santier && (
            <Dialog visible={displayDialog} style={{ width: '450px' }} header="Modificare santier" modal footer={dialogFooter} onHide={() => setDisplayDialog(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="nume">Nume</label>
                        <InputText id="nume" value={santier.nume} onChange={(e) => handleInputChange(e, 'nume')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="latitudine">latitudine</label>
                        <InputText id="latitudine" value={santier.latitudine} onChange={(e) => handleInputChange(e, 'latitudine')} />
                    </div>
                    <div className="p-field">
                         <label htmlFor="longitudine">longitudine</label>
                         <InputText id="longitudine" value={santier.longitudine} onChange={(e) => handleInputChange(e, 'longitudine')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="localitate">Data angajare</label>
                        <InputText id="localitate" value={santier.localitate} onChange={(e) => handleInputChange(e, 'localitate')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="judet">Numar telefon</label>
                        <InputText id="judet" value={santier.judet} onChange={(e) => handleInputChange(e, 'judet')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="adresa">Email</label>
                        <InputText id="adresa" value={santier.adresa} santier={(e) => handleInputChange(e, 'adresa')} />
                    </div>
                </div>
            </Dialog>
        )}
    </Box>
    )
}

export default Santier;