import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Toast } from 'primereact/toast';
import '../pontaje/pontaje.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatisticiPontaje = () => {
    const [angajati, setAngajati] = useState([]);
    const [selectedAngajat, setSelectedAngajat] = useState(null);
    const [pontaje, setPontaje] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartBarData, setChartBarData] = useState({});
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
            setPontaje(data);
            processChartData(data);
            processBarData(data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Fetching Error', detail: error.message });
            console.error('Error:', error);
            setPontaje([]);
        }
    }

    const processChartData = (data) => {
        const santierCount = data.reduce((acc, pontaj) => {
            acc[pontaj.numeSantier] = (acc[pontaj.numeSantier] || 0) + 1;
            return acc;
        }, {});

        const chartData = {
            labels: Object.keys(santierCount),
            datasets: [
                {
                    label: 'Numărul de pontaje',
                    data: Object.values(santierCount),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                },
            ],
        };

        setChartData(chartData);
    }

    const processBarData = (data) => {
        const santierCount = data.reduce((acc, pontaj) => {
            acc[pontaj.numeSantier] = (acc[pontaj.numeSantier] || 0) + 1;
            return acc;
        }, {});
        const barData = {
            labels: Object.keys(santierCount),
            datasets: [
                {
                    label: 'Numarul de pontaje',
                    data: Object.values(santierCount),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        };
        setChartBarData(barData);
    }

    return (
        <div className="content">
            <><Box m="20px">
            <Header title="Statistici pontaje" subtitle="Vizualizare pontaje per angajat" />
            </Box>
            <div className="pontaje">
            <Dropdown value={selectedAngajat} options={angajati} onChange={(e) => setSelectedAngajat(e.value)}
            optionLabel="label" placeholder="Selectează un angajat" filter showClear />
            </div>
             <Grid item xs={12} md={6}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        {Object.keys(chartData).length > 0 ? (
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <Pie data={chartData} />
                            </div>
                        ) : (
                            <p>Nu există date pentru a genera graficul.</p>
                        )}
                    </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop:'2rem' }}>
                        {Object.keys(chartBarData).length > 0 ? (
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <Bar data={chartBarData} options={{ maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p>Nu există date pentru a genera graficul.</p>
                        )}
                    </div>
                </Grid>
            <Toast ref={toast} /></>
        </div>
    );
}

export default StatisticiPontaje;
