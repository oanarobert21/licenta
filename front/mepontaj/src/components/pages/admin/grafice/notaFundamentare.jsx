import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const NotaDeFundamentare = () => {
    const [santiere, setSantiere] = useState([]);
    const [selectedSantier, setSelectedSantier] = useState(null);
    const [angajatiPontaje, setAngajatiPontaje] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        fetchSantiere();
    }, []);

    useEffect(() => {
        if (selectedSantier) {
            fetchAngajatiPontaje(selectedSantier.id);
        }
    }, [selectedSantier]);

    const fetchSantiere = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/santiere/getAllSantiere');
            const data = await response.json();
            setSantiere(data);
        } catch (error) {
            console.error('Error fetching santiere:', error);
        }
    };

    const fetchAngajatiPontaje = async (idSantier) => {
        try {
            const response = await fetch(`http://localhost:8090/api/pontaj/getPontajeBySantier/${idSantier}`);
            const data = await response.json();
            setAngajatiPontaje(data);
        } catch (error) {
            console.error('Error fetching angajati pontaje:', error);
            setAngajatiPontaje([]);
        }
    };

    const timeStringToSeconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const secondsToTimeString = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const aggregatePontajeByAngajat = (pontaje) => {
        const aggregated = {};
        pontaje.forEach(pontaj => {
            const key = `${pontaj.nume} ${pontaj.prenume}`;
            if (!aggregated[key]) {
                aggregated[key] = 0;
            }
            aggregated[key] += timeStringToSeconds(pontaj.durata);
        });
        return aggregated;
    };

    const generatePDF = () => {
        if (!selectedSantier) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Șantierul nu a fost selectat', life: 3000 });
            return;
        }

        const doc = new jsPDF();
        doc.text(`Nota de fundamentare manopera - ${selectedSantier.nume}`, 10, 10);

        const aggregatedPontaje = aggregatePontajeByAngajat(angajatiPontaje);
        const tableColumn = ["Nume", "Prenume", "Ore lucrate"];
        const tableRows = Object.entries(aggregatedPontaje).map(([key, totalSeconds]) => {
            const [nume, prenume] = key.split(' ');
            return [nume, prenume, secondsToTimeString(totalSeconds)];
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });

        const totalSeconds = Object.values(aggregatedPontaje).reduce((total, seconds) => total + seconds, 0);
        const totalHoursFormatted = secondsToTimeString(totalSeconds);
        doc.text(`Total ore lucrate: ${totalHoursFormatted}`, 10, doc.lastAutoTable.finalY + 10);

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
    };

    return (
        <div className="content">
            <Box m="20px">
                <Header title="Nota de fundamentare" subtitle="Generați o notă de fundamentare pentru manoperă" />
            </Box>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Dropdown
                            value={selectedSantier}
                            options={santiere.map(santier => ({ label: santier.nume, value: santier }))}
                            onChange={(e) => setSelectedSantier(e.value)}
                            placeholder="Selectează un șantier"
                            filter
                            showClear
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button label="Generează PDF" onClick={generatePDF} />
                    </Grid>
                </Grid>
                {pdfUrl && (
                    <Grid container spacing={3} mt={3}>
                        <Grid item xs={12}>
                            <iframe src={pdfUrl} width="100%" height="500px" />
                        </Grid>
                    </Grid>
                )}
            </Container>
            <Toast ref={toast} />
        </div>
    );
};

export default NotaDeFundamentare;
