import React, { useState, useRef, useCallback } from 'react';
import '../admin.css';
import { Box } from '@mui/material';
import Header from '../Header';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../santiere/santier.css';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ["places"];
const mapContainerStyle = {
    width: '100%',
    height: '400px'
};
const initialCenter = {
    lat: 44.4268,
    lng: 26.1025
};

const options = {
    mapTypeControl: false, 
};


const AdaugareSantier = () => {
    const [nume, setNume] = useState('');
    const [latitudine, setLat] = useState('');
    const [longitudine, setLong] = useState('');
    const [raza, setRaza] = useState('');
    const [localitate, setLocalitate] = useState('');
    const [judet, setJudet] = useState('');
    const [adresa, setAdresa] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [selected, setSelected] = useState(null);
    const [center, setCenter] = useState(initialCenter);
    const [searchBox, setSearchBox] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBSPayaTcB4DSYEiMlzwXV42_atSKUfeSI',
        libraries
    });

    const onLoadSearchBox = (ref) => {
        setSearchBox(ref);
    };

    const onPlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces();
            if (places.length === 0) {
                return;
            }
            const place = places[0];
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const addressComponents = place.address_components;
            let locality = '';
            let county = '';
            let fullAddress = place.formatted_address;

            addressComponents.forEach(component => {
                const types = component.types;
                if (types.includes('locality')) {
                    locality = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    county = component.long_name;
                }
            });

            setLat(lat);
            setLong(lng);
            setLocalitate(locality);
            setJudet(county);
            setAdresa(fullAddress);
            setSelected({ lat, lng });
            setCenter({ lat, lng });
        }
    };

    const load = () => {
        setLoading(true);
        const data = { nume, latitudine, longitudine, raza, localitate, judet, adresa };
        fetch('http://localhost:8090/api/santiere/addSantier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw (errData.message || errData.errors);
                });
            }
            return response.json();
        })
        .then(data => {
            toast.current.show({ severity: 'success', summary: 'Adaugat', detail: 'Santier adaugat cu succes!' });
            setLoading(false);
        })
        .catch(errors => {
            console.error('Error:', errors);
            let detailMessage;
            if (Array.isArray(errors)) {
                detailMessage = errors.join(", "); 
            } else {
                detailMessage = errors; 
            }
            toast.current.show({ severity: 'error', summary: 'Eroare', detail: detailMessage });
            setLoading(false);
        });
    };

    if (loadError) return <div>Map cannot be loaded right now, sorry.</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;
    
    return (
        <div>
            <Box m="20px">
                <Header title="Adaugare șantiere" subtitle="Adaugare șantiere" />
            </Box>
            <div className="containerSantier">
                <div className="formularAsignare">
                    <FloatLabel className="p-float-label">
                        <InputText id="nume" value={nume} onChange={(e) => setNume(e.target.value)} />
                        <label htmlFor="nume">Nume</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="lat" value={latitudine} onChange={(e) => setLat(e.target.value)} />
                        <label htmlFor="lat">Latitudine</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="long" value={longitudine} onChange={(e) => setLong(e.target.value)} />
                        <label htmlFor="long">Longitudine</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="raza" value={raza} onChange={(e) => setRaza(e.target.value)} />
                        <label htmlFor="raza">Raza</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="localitate" value={localitate} onChange={(e) => setLocalitate(e.target.value)} />
                        <label htmlFor="localitate">Localitate</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="judet" value={judet} onChange={(e) => setJudet(e.target.value)} />
                        <label htmlFor="judet">Judet</label>
                    </FloatLabel>
                    <FloatLabel className="p-float-label">
                        <InputText id="adresa"  value={adresa} onChange={(e) => setAdresa(e.target.value)} />
                        <label htmlFor="adresa">Adresa</label>
                    </FloatLabel>
                    <div className="btnSantier">
                        <Button id="btnSantier" label="Submit" icon="pi pi-check" loading={loading} onClick={load} />
                    </div>
                </div>
                <div className="map-container">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                        options={options}
                    >
                        <StandaloneSearchBox
                            onLoad={onLoadSearchBox}
                            onPlacesChanged={onPlacesChanged}
                        >
                            <InputText
                                placeholder="Cauta o locatie"
                                style={{
                                    boxSizing: `border-box`,
                                    border: `1px solid transparent`,
                                    width: `240px`,
                                    height: `32px`,
                                    marginTop: `10px`,
                                    padding: `0 12px`,
                                    borderRadius: `3px`,
                                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                    fontSize: `14px`,
                                    outline: `none`,
                                    textOverflow: `ellipses`,
                                    position: "absolute",
                                    left: "50%",
                                    marginLeft: "-120px"
                                }}
                            />
                        </StandaloneSearchBox>
                        {selected && <Marker position={selected} />}
                    </GoogleMap>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
}
 export default AdaugareSantier;