// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Container, Grid } from '@mui/material';
// import Header from '../Header';
// import { Dropdown } from 'primereact/dropdown';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
// import { Toast } from 'primereact/toast';
// import '../concedii/concedii.css';
// import 'chartjs-adapter-date-fns';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// const ConcediiStatistici = () => {
//     const [angajati, setAngajati] = useState([]);
//     const [selectedAngajat, setSelectedAngajat] = useState(null);
//     const [concedii, setConcedii] = useState([]);
//     const [chartData, setChartData] = useState({});
//     const toast = useRef(null);

//     useEffect(() => {
//         fetchAngajati();
//     }, []);

//     useEffect(() => {
//         if (selectedAngajat) {
//             fetchConcedii(selectedAngajat);
//         }
//     }, [selectedAngajat]);

//     async function fetchAngajati() {
//         try {
//             const response = await fetch('http://localhost:8090/api/angajati/getAllAngajati');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch angajati');
//             }
//             const data = await response.json();
//             const formattedAngajati = data.map(angajat => ({
//                 label: `${angajat.nume} ${angajat.prenume}`,
//                 value: angajat.idAngajat
//             }));
//             setAngajati(formattedAngajati);
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Atenție!', detail: error.message });
//             console.error('Error:', error);
//         }
//     }

//     async function fetchConcedii(idAngajat) {
//         try {
//             const response = await fetch(`http://localhost:8090/api/concedii/getConcediuByIdAngajat/${idAngajat}`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error('Nu există concedii pentru angajatul selectat!');
//             }
//             const data = await response.json();
//             setConcedii(data);
//             processChartData(data);
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Atenție!', detail: error.message });
//             console.error('Error:', error);
//             setConcedii([]);
//         }
//     }

//     const processChartData = (data) => {
//         const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//         const monthlyData = {};
        
//         data.forEach(concediu => {
//             const startMonth = new Date(concediu.dataInceput).getMonth();
//             const days = (new Date(concediu.dataSfarsit) - new Date(concediu.dataInceput)) / (1000 * 60 * 60 * 24);

//             if (!monthlyData[startMonth]) {
//                 monthlyData[startMonth] = {};
//             }

//             if (!monthlyData[startMonth][concediu.tipConcediu]) {
//                 monthlyData[startMonth][concediu.tipConcediu] = 0;
//             }

//             monthlyData[startMonth][concediu.tipConcediu] += days;
//         });

//         const chartLabels = months;
//         const typesOfLeave = Array.from(new Set(data.map(concediu => concediu.tipConcediu)));
//         const datasets = typesOfLeave.map(type => ({
//             label: type,
//             data: chartLabels.map((_, month) => monthlyData[month] ? monthlyData[month][type] || 0 : 0),
//             backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
//             borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
//             borderWidth: 1,
//         }));

//         const chartData = {
//             labels: chartLabels,
//             datasets,
//         };

//         setChartData(chartData);
//     }

//     return (
//         <div className="content">
//             <Box m="20px">
//                 <Header title="Statistici Concedii" subtitle="Vizualizare concedii per angajat" />
//             </Box>
//             <div className="concedii">
//                 <Dropdown 
//                     value={selectedAngajat} 
//                     options={angajati} 
//                     onChange={(e) => setSelectedAngajat(e.value)}
//                     optionLabel="label" 
//                     placeholder="Selectează un angajat" 
//                     filter 
//                     showClear 
//                     className="dropdown-custom"
//                 />
//             </div>
//             <Grid container justifyContent="center" style={{ marginTop: '2rem' }}>
//                 <Grid item xs={12} md={10} className="chart-wrapper">
//                     {Object.keys(chartData).length > 0 ? (
//                         <div className="chart-container">
//                             <Bar 
//                                 data={chartData} 
//                                 options={{ 
//                                     maintainAspectRatio: false, 
//                                     scales: { x: { stacked: true }, y: { stacked: true } },
//                                     plugins: {
//                                         legend: {
//                                             display: true,
//                                             position: 'top',
//                                         }
//                                     }
//                                 }} 
//                             />
//                         </div>
//                     ) : (
//                         <p>Nu există date pentru a genera graficele.</p>
//                     )}
//                 </Grid>
//             </Grid>
//             <Toast ref={toast} />
//         </div>
//     );
// }

// export default ConcediiStatistici;

// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Container, Grid } from '@mui/material';
// import Header from '../Header';
// import { Dropdown } from 'primereact/dropdown';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
// import { Toast } from 'primereact/toast';
// import '../concedii/concedii.css';
// import 'chartjs-adapter-date-fns';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// const ConcediiStatistici = () => {
//     const [angajati, setAngajati] = useState([]);
//     const [selectedAngajat, setSelectedAngajat] = useState(null);
//     const [concedii, setConcedii] = useState([]);
//     const [chartData, setChartData] = useState({});
//     const toast = useRef(null);

//     useEffect(() => {
//         fetchAngajati();
//     }, []);

//     useEffect(() => {
//         if (selectedAngajat) {
//             fetchConcedii(selectedAngajat);
//         }
//     }, [selectedAngajat]);

//     async function fetchAngajati() {
//         try {
//             const response = await fetch('http://localhost:8090/api/angajati/getAllAngajati');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch angajati');
//             }
//             const data = await response.json();
//             const formattedAngajati = data.map(angajat => ({
//                 label: `${angajat.nume} ${angajat.prenume}`,
//                 value: angajat.idAngajat
//             }));
//             setAngajati(formattedAngajati);
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Atenție!', detail: error.message });
//             console.error('Error:', error);
//         }
//     }

//     async function fetchConcedii(idAngajat) {
//         try {
//             const response = await fetch(`http://localhost:8090/api/concedii/getConcediuByIdAngajat/${idAngajat}`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error('Nu există concedii pentru angajatul selectat!');
//             }
//             const data = await response.json();
//             const filteredData = data.filter(concediu => concediu.status === 'Acceptat');
//             setConcedii(filteredData);
//             processChartData(filteredData);
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Atenție!', detail: error.message });
//             console.error('Error:', error);
//             setConcedii([]);
//         }
//     }

//     const processChartData = (data) => {
//         const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
//         const monthlyData = {};
        
//         data.forEach(concediu => {
//             const startMonth = new Date(concediu.dataInceput).getMonth();
//             const days = (new Date(concediu.dataSfarsit) - new Date(concediu.dataInceput)) / (1000 * 60 * 60 * 24);

//             if (!monthlyData[startMonth]) {
//                 monthlyData[startMonth] = {};
//             }

//             if (!monthlyData[startMonth][concediu.tipConcediu]) {
//                 monthlyData[startMonth][concediu.tipConcediu] = 0;
//             }

//             monthlyData[startMonth][concediu.tipConcediu] += days;
//         });

//         const chartLabels = months;
//         const typesOfLeave = Array.from(new Set(data.map(concediu => concediu.tipConcediu)));
//         const datasets = typesOfLeave.map(type => ({
//             label: type,
//             data: chartLabels.map((_, month) => monthlyData[month] ? monthlyData[month][type] || 0 : 0),
//             backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
//             borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
//             borderWidth: 1,
//         }));

//         const chartData = {
//             labels: chartLabels,
//             datasets,
//         };

//         setChartData(chartData);
//     }

//     return (
//         <div className="content">
//             <Box m="20px">
//                 <Header title="Statistici Concedii" subtitle="Vizualizare concedii per angajat" />
//             </Box>
//             <div className="concedii">
//                 <Dropdown 
//                     value={selectedAngajat} 
//                     options={angajati} 
//                     onChange={(e) => setSelectedAngajat(e.value)}
//                     optionLabel="label" 
//                     placeholder="Selectează un angajat" 
//                     filter 
//                     showClear 
//                     className="dropdown-custom"
//                 />
//             </div>
//             <Grid container justifyContent="center" style={{ marginTop: '2rem' }}>
//                 <Grid item xs={12} md={10} className="chart-wrapper">
//                     {Object.keys(chartData).length > 0 ? (
//                         <div className="chart-container">
//                             <Bar 
//                                 data={chartData} 
//                                 options={{ 
//                                     maintainAspectRatio: false, 
//                                     scales: { x: { stacked: true }, y: { stacked: true } },
//                                     plugins: {
//                                         legend: {
//                                             display: true,
//                                             position: 'top',
//                                         }
//                                     }
//                                 }} 
//                             />
//                         </div>
//                     ) : (
//                         <p>Nu există date pentru a genera graficele.</p>
//                     )}
//                 </Grid>
//             </Grid>
//             <Toast ref={toast} />
//         </div>
//     );
// }

// export default ConcediiStatistici;

import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Header from '../Header';
import { Dropdown } from 'primereact/dropdown';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Toast } from 'primereact/toast';
import '../concedii/concedii.css';
import 'chartjs-adapter-date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const concediiLimits = {
    'De odihnă': 20,
    'Pentru formare profesională': 0, // Depinde de acordul angajatorului
    'Fără plată': 0, // Depinde de acordul angajatorului
    'Medical': 0, // Depinde de certificatul medical
    'Risc maternal': 120,
    'De maternitate': 126,
    'Paternal': 5,
    'Pentru creșterea copilului': 730, // 2 ani
    'Pentru îngrijirea copilului bolnav': 45,
    'Pentru îngrijirea copilului cu dizabilități': 90,
    'Pentru evenimente deosebite': 0, // Depinde de acordul angajatorului
    'Pentru carantină': 0, // Depinde de decizia autorităților
    'De acomodare': 365, // 1 an
    'De îngrijitor': 5,
};

const ConcediiStatistici = () => {
    const [angajati, setAngajati] = useState([]);
    const [selectedAngajat, setSelectedAngajat] = useState(null);
    const [concedii, setConcedii] = useState([]);
    const [chartData, setChartData] = useState({});
    const toast = useRef(null);

    useEffect(() => {
        fetchAngajati();
    }, []);

    useEffect(() => {
        if (selectedAngajat) {
            fetchConcedii(selectedAngajat);
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
            toast.current.show({ severity: 'error', summary: 'Atenție!', detail: error.message });
            console.error('Error:', error);
        }
    }

    async function fetchConcedii(idAngajat) {
        try {
            const response = await fetch(`http://localhost:8090/api/concedii/getConcediuByIdAngajat/${idAngajat}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Nu există concedii pentru angajatul selectat!');
            }
            const data = await response.json();
            const filteredData = data.filter(concediu => concediu.status === 'Acceptat');
            setConcedii(filteredData);
            processChartData(filteredData);
            checkConcediiLimits(filteredData);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Atenție!', detail: error.message });
            console.error('Error:', error);
            setConcedii([]);
        }
    }

    const checkConcediiLimits = (data) => {
        const daysByType = data.reduce((acc, concediu) => {
            const days = (new Date(concediu.dataSfarsit) - new Date(concediu.dataInceput)) / (1000 * 60 * 60 * 24);
            acc[concediu.tipConcediu] = (acc[concediu.tipConcediu] || 0) + days;
            return acc;
        }, {});

        for (const [type, days] of Object.entries(daysByType)) {
            if (concediiLimits[type] > 0 && days > concediiLimits[type]) {
                toast.current.show({ severity: 'warn', summary: 'Depășire limită', detail: `Angajatul are mai multe zile de tipul : ,,${type}" decât limita legală de ${concediiLimits[type]} zile.` });
            }
        }
    }

    const processChartData = (data) => {
        const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
        const monthlyData = {};
        
        data.forEach(concediu => {
            const startMonth = new Date(concediu.dataInceput).getMonth();
            const days = (new Date(concediu.dataSfarsit) - new Date(concediu.dataInceput)) / (1000 * 60 * 60 * 24);

            if (!monthlyData[startMonth]) {
                monthlyData[startMonth] = {};
            }

            if (!monthlyData[startMonth][concediu.tipConcediu]) {
                monthlyData[startMonth][concediu.tipConcediu] = 0;
            }

            monthlyData[startMonth][concediu.tipConcediu] += days;
        });

        const chartLabels = months;
        const typesOfLeave = Array.from(new Set(data.map(concediu => concediu.tipConcediu)));
        const datasets = typesOfLeave.map(type => ({
            label: type,
            data: chartLabels.map((_, month) => monthlyData[month] ? monthlyData[month][type] || 0 : 0),
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
            borderWidth: 1,
        }));

        const chartData = {
            labels: chartLabels,
            datasets,
        };

        setChartData(chartData);
    }

    return (
        <div className="content">
            <Box m="20px">
                <Header title="Statistici Concedii" subtitle="Vizualizare concedii per angajat" />
            </Box>
            <div className="concedii">
                <Dropdown 
                    value={selectedAngajat} 
                    options={angajati} 
                    onChange={(e) => setSelectedAngajat(e.value)}
                    optionLabel="label" 
                    placeholder="Selectează un angajat" 
                    filter 
                    showClear 
                    className="dropdown-custom"
                />
            </div>
            <Grid container justifyContent="center" style={{ marginTop: '2rem' }}>
                <Grid item xs={12} md={10} className="chart-wrapper">
                    {Object.keys(chartData).length > 0 ? (
                        <div className="chart-container">
                            <Bar 
                                data={chartData} 
                                options={{ 
                                    maintainAspectRatio: false, 
                                    scales: { x: { stacked: true }, y: { stacked: true } },
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        }
                                    }
                                }} 
                            />
                        </div>
                    ) : (
                        <p>Nu există date pentru a genera graficele.</p>
                    )}
                </Grid>
            </Grid>
            <Toast ref={toast} />
        </div>
    );
}

export default ConcediiStatistici;
