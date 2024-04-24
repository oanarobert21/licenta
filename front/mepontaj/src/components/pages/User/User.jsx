import React, { useState } from 'react';
import styles from './User.module.css';
import {useNavigate} from 'react-router-dom';
import { useUser } from './UserContext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primeflex/primeflex.css'; 

const User = () => {
    const [visible, setVisible] = useState(false);
    const [tipConcediu, setConcediu] = useState(null);
    const [dates, setDates] = useState(null);
    const [value, setValue] = useState('');
    const [isFormValid, setIsFormValid] = useState(true);
    const {user, setUser} = useUser();
    const navigate = useNavigate(); 
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setUser(null);
        navigate('/');
    };

    const handleSubmit = () => {
        if (!tipConcediu || !dates || !value.trim()) {
            setIsFormValid(false);
        } else {
            setIsFormValid(true);
            setVisible(false);
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

    return (
        <div className={styles.userContainer}>
        <div className={styles.wrapper}>
            <div className={styles.text}>Bine ai venit, {user ? user.prenume + ' ' + user.nume : 'user'}!</div>
            <div className={styles.imagine}>
                <img src={require('./../../assets/muncitor-2.png')} alt="User" width="100px" height="100px" />
            </div>
            <div className={styles.btnPontaj}>
                <Button label="Pontaj inițial" severity="secondary" text raised />
            </div>
            <div className={styles.btnPontaj}>
                <Button label="Pontaj final" severity="secondary" text raised />
            </div>
            <div className={styles.btnConcediu}>
                <Button label="Cerere concediu" severity="secondary" text raised onClick={() => setVisible(true)} />
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
                        <label htmlFor="username">Perioadă concediu</label>
                        <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection className="w-full md:w-14rem" />
                        <label htmlFor="username">Motiv</label>
                        <InputTextarea autoResize value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} className="w-full md:w-14rem" />
                        {!isFormValid && <small className="p-error">Toate câmpurile trebuie completate.</small>}
                        <Button className={styles.submitButton} type="button" label="Submit" onClick={handleSubmit} />
                    </div>
                </div>
            </Dialog>
        </div>
        </div>
    );
}

export default User;
