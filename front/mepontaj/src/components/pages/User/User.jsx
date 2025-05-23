import React, { useState, useEffect, useRef } from 'react';
import styles from './User.module.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { format } from 'date-fns';
import 'primeflex/primeflex.css';

const User = () => {
    const [visible, setVisible] = useState(false);
    const [tipConcediu, setConcediu] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [finalDate, setFinalDate] = useState(null);
    const [pontajeVisible, setPontajeVisible] = useState(false); 
    const [pontaje, setPontaje] = useState([]); 
    const [value, setValue] = useState('');
    const [isFormValid, setIsFormValid] = useState(true);
    const { user, setUser } = useUser();
    const [userLocation, setUserLocation] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [showConcedii, setShowConcedii] = useState([]);
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setUser(null);
        navigate('/');
    };

    const handleSubmit = () => {
        if (!tipConcediu || !startDate || !finalDate || !value.trim()) {
            setIsFormValid(false);
        } else {
            setIsFormValid(true);
            setVisible(false);
            handleConcediu();
        }
    };

    const concedii = [
        { name: 'De odihnă', code: 'CO' },
        { name: 'Pentru formare profesională', code: 'CFP' },
        { name: 'Fără plată', code: 'CFP' },
        { name: 'Medical', code: 'CM' },
        { name: 'Risc maternal', code: 'CRM' },
        { name: 'De maternitate', code: 'CMAT' },
        { name: 'Paternal', code: 'CPAT' },
        { name: 'Pentru creșterea copilului', code: 'CC' },
        { name: 'Pentru îngrijirea copilului bolnav', code: 'CICB' },
        { name: 'Pentru îngrijirea copilului cu dizabilități', code: 'CICD' },
        { name: 'Pentru evenimente deosebite', code: 'CED' },
        { name: 'Pentru carantină', code: 'CQ' },
        { name: 'De acomodare', code: 'CA' },
        { name: 'De îngrijitor', code: 'CI' }
    ];

    const getLocation = (type) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitudine: latitude, longitudine: longitude });
                    console.log('Locația a fost determinată:', latitude, longitude);
                    handlePontaj(type, { latitudine: latitude, longitudine: longitude });
                },
                (error) => {
                    alert(`Eroare la determinarea locației: ${error.message}`);
                    console.log(error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handlePontaj = async (type, location) => {
        try {
            const { latitudine, longitudine } = location;
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8090/api/pontaj/addPontaj', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    latitudine,
                    longitudine,
                    type
                })
            });
            if (!response.ok) {
                const error = await response.json();
                // alert(error.message);
                toast.current.show({ severity: 'error', summary: 'Pontaj', detail: error.message })
                return;
            } else {
                const data = await response.json();
                toast.current.show({ severity: 'success', summary: 'Pontaj', detail: `Pontajul ${type} a fost înregistrat cu succes.` });
            }
        } catch (error) {
            console.error(`Eroare la pontajul ${type}:`, error);
            alert(`Eroare la pontajul ${type}. Verificați logurile pentru detalii.`);
        }
    };

    const performPontaj = (type) => {
        getLocation(type);
    };

    const handleConcediu = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8090/api/concedii/addConcediu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tipConcediu: tipConcediu.name,
                    dataInceput: startDate,
                    dataSfarsit: finalDate,
                    motiv: value,
                    status: 'În așteptare'
                })
            });
            if (!response.ok) {
                const error = await response.json();
                alert(error.message);
                toast.current.show({ severity: 'error', summary: 'Concediu', detail: error.message });
                return;
            } else {
                const data = await response.json();
                toast.current.show({ severity: 'success', summary: 'Concediu', detail: 'Cererea de concediu a fost înregistrată cu succes.' });
                fetchConcedii(user.idAngajat);
            }
        } catch (error) {
            console.error('Eroare la adăugarea concediului:', error);
            alert('Eroare la adăugarea concediului. Verificați logurile pentru detalii.');
        }
    }

    const fetchConcedii = async (idAngajat) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8090/api/concedii/getConcediuByIdAngajat/${idAngajat}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setShowConcedii(data);

            } else {
                console.error('Failed to fetch concedii');
            }
        } catch (error) {
            console.error('Eroare la aducerea concediilor:', error);
            alert('Eroare la aducerea concediilor. Verificați logurile pentru detalii.');
        }
    }

    const fetchPontaje = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8090/api/pontaj/getPontajByIdAngajat/${user.idAngajat}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPontaje(data);
                setPontajeVisible(true); 
            } else {
                console.error('Failed to fetch pontaje');
            }
        } catch (error) {
            console.error('Eroare la aducerea pontajelor:', error);
            alert('Eroare la aducerea pontajelor. Verificați logurile pentru detalii.');
        }
    };

    const handleFetchConcedii = () => {
        if (user && user.idAngajat) {
            fetchConcedii(user.idAngajat);
            setDialogVisible(true);
        } else {
            console.error('User or user.idAngajat is undefined:', user);
        }
    }

    const dialogFooterTemplate = () => {
        return <Button label="Ok" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
    };

    const pontajeFooterTemplate = () => {
        return <Button label="Ok" icon="pi pi-check" onClick={() => setPontajeVisible(false)} />;
    };

    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy');
    }

    const formatDateTime = (value) => {
        return format(new Date(value), 'dd/MM/yyyy HH:mm:ss');
    };

    const handleFinalDateChange = (e) => {
        const selectedDate = e.value;
        if (startDate && selectedDate < startDate) {
            toast.current.show({ severity: 'error', summary: 'Eroare', detail: 'Data de sfârșit nu poate fi înaintea datei de început.' });
            e.originalEvent.preventDefault(); 
            return;
        }
        setFinalDate(selectedDate);
    };
    

    const handleStartDateChange = (e) => {
        const selectedDate = e.value;
        setStartDate(selectedDate);
        if (finalDate && finalDate < selectedDate) {
            setFinalDate(null);
        }
    };
    
    
    const filteredPontaje = pontaje.map(p => ({
        start: p.start,
        durata: p.durata,
        numeSantier: p.numeSantier
    }));

    return (
        <div className={styles.userContainer}>
            <div className={styles.wrapper}>
                <div className={styles.text}>Bine ai venit, {user ? user.prenume + ' ' + user.nume : 'user'}!</div>
                <div className={styles.imagine}>
                    <img src={require('./../../assets/muncitor-2.png')} alt="User" width="100px" height="100px" />
                </div>
                <div className={styles.btnPontaj}>
                    <Button label="Pontaj inițial" severity="secondary" text raised onClick={() => performPontaj('start')} />
                </div>
                <div className={styles.btnPontaj}>
                    <Button label="Pontaj final" severity="secondary" text raised onClick={() => performPontaj('final')} />
                </div>
                <div className={styles.btnPontaj}>
                    <Button label="Pontaje realizate" severity="secondary" text raised onClick={fetchPontaje} />
                </div>
                <div className={styles.btnConcediu}>
                    <Button label="Cerere concediu" severity="secondary" text raised onClick={() => setVisible(true)} />
                </div>
                <div className={styles.btnConcediu}>
                    <Button label="Status cereri" severity="secondary" text raised onClick={handleFetchConcedii} />
                </div>
                <div>
                    <Dialog header="Status cereri" visible={dialogVisible} style={{ width: '75vw' }} maximizable
                        modal contentStyle={{ height: '300px' }} onHide={() => setDialogVisible(false)} footer={dialogFooterTemplate}>
                        <DataTable value={showConcedii} scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}>
                            <Column field="tipConcediu" header="Tip concediu"></Column>
                            <Column field="dataInceput" header="Data început" body={(rowData) => formatDate(rowData.dataInceput)}></Column>
                            <Column field="dataSfarsit" header="Data sfârșit" body={(rowData) => formatDate(rowData.dataSfarsit)}></Column>
                            <Column field="status" header="Status"></Column>
                        </DataTable>
                    </Dialog>
                </div>
                <div>
                    <Dialog header="Pontaje realizate" visible={pontajeVisible} style={{ width: '75vw' }} maximizable
                        modal contentStyle={{ height: '300px' }} onHide={() => setPontajeVisible(false)} footer={pontajeFooterTemplate}>
                        <DataTable value={filteredPontaje} scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}>
                            <Column field="start" header="Data pontaj" body={(rowData) => formatDateTime(rowData.start)}></Column>
                            <Column field="durata" header="Durata"></Column>
                            <Column field="numeSantier" header="Santier"></Column>
                        </DataTable>
                    </Dialog>
                </div>
                <div className={styles.btnConcediu}>
                    <Button label="Iesire" severity="secondary" text raised onClick={() => handleLogout()} />
                </div>
                <Dialog visible={visible} style={{ width: '40rem' }} onHide={() => setVisible(false)}>
                    <div className="card flex justify-content-center">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Tip concediu</label>
                            <Dropdown value={tipConcediu} onChange={(e) => setConcediu(e.value)} options={concedii} optionLabel="name"
                                placeholder="Tip concediu" className="w-full md:w-14rem" />
                            <label htmlFor="username">Dată început concediu</label>
                            <Calendar value={startDate} onChange={handleStartDateChange} dateFormat="dd/mm/yy"  className="w-full md:w-14rem" />                            <label htmlFor="username">Dată sfârșit concediu</label>
                            <Calendar value={finalDate} onChange={handleFinalDateChange} dateFormat="dd/mm/yy" className="w-full md:w-14rem" />
                            <label htmlFor="username">Motiv</label>
                            <InputTextarea autoResize value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} className="w-full md:w-14rem" />
                            {!isFormValid && <small className="p-error">Toate câmpurile trebuie completate.</small>}
                            <Button className={styles.submitButton} type="button" label="Submit" onClick={handleSubmit} />
                        </div>
                    </div>
                </Dialog>
            </div>
            <Toast ref={toast} />
        </div>
    );
}

export default User;
