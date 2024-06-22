import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {format} from 'date-fns';
import { Calendar } from 'primereact/calendar';
import '../pontaje/pontaje.css';
import { TabPanel } from 'primereact/tabview';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Pontaje = () => {
    const [angajati, setAngajati] = useState([]);
    const [selectedAngajat, setSelectedAngajat] = useState(null);
    const [pontaje, setPontaje] = useState([]);
    const toast = useRef(null);
    const [dateRange, setDateRange] = useState(null);
    const dt = useRef(null);


    useEffect(() => {
        fetchAngajati();
    }, []); 

    useEffect(() => {
        if (selectedAngajat) {
            fetchPontaje(selectedAngajat);
        }
    }, [selectedAngajat]);

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

    async function fetchPontaje(idAngajat) {
        try {
            const response = await fetch(`http://localhost:8090/api/pontaj/getPontajByIdAngajat/${idAngajat}`);
            if (!response.ok) {
                throw new Error('Failed to fetch pontaje');
            }
            const data = await response.json();
            if (data.length === 0) {
                toast.current.show({ severity: 'info', summary: 'Info', detail: 'Nu există pontaje pentru acest angajat' });
            }
            setPontaje(data);
        } catch (error) {
            console.error('Error:', error);
            setPontaje([]);
        }
    }
    
    const onDateChange = (e) => {
        setDateRange(e.value);
    };

    const formatDateTime = (value) => {
        return format(new Date(value), 'dd/MM/yyyy HH:mm:ss');
    }

    const formatExportData = (data) => {
        return data.map(row => ({
            numeAngajat: row.numeAngajat,
            start: formatDateTime(row.start),
            final: formatDateTime(row.final),
            durata: row.durata,
            numeSantier: row.numeSantier
        }));
    }

    const getSelectedAngajatLabel = () => {
        const angajat = angajati.find(a => a.value === selectedAngajat);
        return angajat ? angajat.label.replace(/\s/g, '_') : 'export';
    }

    const exportColumns = [
        { title: 'Nume', dataKey: 'numeAngajat' },
        { title: 'Pontaj initial', dataKey: 'start' },
        { title: 'Pontaj final', dataKey: 'final' },
        { title: 'Durata', dataKey: 'durata' },
        { title: 'Santier', dataKey: 'numeSantier' }
    ];

    const exportCSV = () => {
        const exportData = formatExportData(filteredPontaje);
        const fileName = getSelectedAngajatLabel();
        const csv = exportData.map(row => exportColumns.map(col => row[col.dataKey]).join(',')).join('\n');
        const csvHeader = exportColumns.map(col => col.title).join(',');
        const csvContent = `${csvHeader}\n${csv}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileName}.csv`);
    };

    const exportPdf = () => {
        const exportData = formatExportData(filteredPontaje);
        const fileName = getSelectedAngajatLabel();
        const angajatLabel = 'Pontaje ' + getSelectedAngajatLabel().replace(/_/g, ' ');
        const doc = new jsPDF();
    
        doc.setFontSize(18);
        doc.setFont("poppins");
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(angajatLabel);
        const x = (pageWidth - textWidth) / 2;
        doc.text(angajatLabel, x, 20);
    
        doc.autoTable({
            startY: 30,
            head: [exportColumns.map(col => col.title)],
            body: exportData.map(row => exportColumns.map(col => row[col.dataKey])),
            styles: { cellPadding: 2, fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 'auto', minCellHeight: 10 }, 
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 'auto' }
            },
            headStyles: {
                fillColor: [41, 128, 185]
            },
            bodyStyles: {
                valign: 'top',
                halign: 'left',
            }
        });
        doc.save(`${fileName}.pdf`);
    };
    

    const exportExcel = () => {
        const exportData = formatExportData(filteredPontaje);
        const fileName = getSelectedAngajatLabel();
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        saveAsExcelFile(excelBuffer, fileName);
    };

    const saveAsExcelFile = (buffer, fileName) => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
    };

    const filteredPontaje = pontaje.filter(p => {
        if (!dateRange) return true;
        const [startDate, endDate] = dateRange;
        const pontajDate = new Date(p.start).getTime();
        if (startDate && pontajDate < new Date(startDate).getTime()) return false;
        if (endDate && pontajDate == new Date(endDate).getTime()) return false;
        return true;
    });

    const header = (
        <div className="flex align-items-center justify-content-end gap-1">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return (
        <div className="content">
            <Box m="20px">
                <Header title="Vizualizare pontaje" subtitle="Vizualizati pontajele" />
            </Box>
            <div className="pontaje">
                <Dropdown value={selectedAngajat} options={angajati} onChange={(e) => setSelectedAngajat(e.value)}
                    optionLabel="label" placeholder="Selectează un angajat" filter showClear />
                <Calendar value={dateRange} onChange={onDateChange} placeholder="Selectează un interval" selectionMode="range" dateFormat="dd/mm/yy" showClear />
            </div>
            <div className="tabelPontaje">
                <DataTable value={filteredPontaje} ref={dt} paginator rows={10} header={header} rowsPerPageOptions={[5, 10, 25]} emptyMessage="Nu există pontaje">
                    <Column field="numeAngajat" header="Nume" />
                    <Column field="start" header="Pontaj initial" body={(rowData) => formatDateTime(rowData.start)} />
                    <Column field="final" header="Pontaj final" body={(rowData) => formatDateTime(rowData.final)}/>
                    <Column field="durata" header="Durata pontaj" />
                    <Column field="numeSantier" header="Santier" />
                </DataTable>
            </div>
            <Toast ref={toast} />
        </div>
    );
}
export default Pontaje;