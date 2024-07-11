import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { Calendar, momentLocalizer, Views  } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import '../pontaje/pontaje.css';

const localizer = momentLocalizer(moment);

const Pontaje = () => {
    const [angajati, setAngajati] = useState([]);
    const [selectedAngajat, setSelectedAngajat] = useState(null);
    const [pontaje, setPontaje] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [open, setOpen] = useState(false);
    const toast = useRef(null);

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

    const calculateTotalHours = (pontaje) => {
        const hoursMap = {};
        pontaje.forEach(p => {
            if (p.durata) {
                const dateKey = format(new Date(p.start), 'yyyy-MM-dd');
                const duration = p.durata.split(':');
                const hours = parseInt(duration[0], 10);
                const minutes = parseInt(duration[1], 10) / 60;
                const totalHours = hours + minutes;
                if (!hoursMap[dateKey]) {
                    hoursMap[dateKey] = [];
                }
                hoursMap[dateKey].push({
                    ...p,
                    totalHours,
                    santier: p.numeSantier  
                });
            }
        });
        return hoursMap;
    };

    const hoursMap = calculateTotalHours(pontaje);

    const events = Object.keys(hoursMap).map(dateKey => ({
        title: `${hoursMap[dateKey].reduce((sum, p) => sum + p.totalHours, 0).toFixed(2)} h`,
        start: new Date(dateKey),
        end: new Date(dateKey),
        details: hoursMap[dateKey]
    }));

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div className="content">
            <Box m="20px">
                <Header title="Calendar pontaje" subtitle="Vizualizati pontajele" />
            </Box>
            <div className="pontaje">
                <Dropdown
                    value={selectedAngajat}
                    options={angajati}
                    onChange={(e) => setSelectedAngajat(e.value)}
                    optionLabel="label"
                    placeholder="Selectează un angajat"
                    filter
                    showClear
                />
            </div>
            <div className="calendar-container" id="calendar">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView={Views.MONTH}
                    views={['month']}
                    style={{ height: 500, margin: '50px' }}
                    onSelectEvent={handleEventClick}
                />
            </div>
            <Dialog header="Detalii Pontaj" visible={open} style={{ width: '15rem' }} onHide={handleClose}>
                {selectedEvent && selectedEvent.details.map((detail, index) => (
                    <Box key={index} mb={2}>
                        <Typography variant="body1">Data: {format(new Date(detail.start), 'dd/MM/yyyy')}</Typography>
                        <Typography variant="body1">Durata: {detail.totalHours.toFixed(2)} h</Typography>
                        <Typography variant="body1">Șantier: {detail.santier}</Typography>
                    </Box>
                ))}
                <Button label="Închide" onClick={handleClose} />
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
}

export default Pontaje;
