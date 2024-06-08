const Angajati = require('../models').Angajati;
const Pontaj = require('../models').Pontaj;
const Santier = require('../models').Santier;
const AngajatiSantiere = require('../models').AngajatiSantiere;

const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "A token is required for authentication" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
    return next();
};

const addPontaj = async (req, res) => {
    try {
        const { latitudine, longitudine, type } = req.body;
        const idAngajat = req.user.idAngajat;
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayStart.getDate() + 1);

        const assignedSites = await AngajatiSantiere.findAll({
            where: { idAngajat: idAngajat },
            include: [{
                model: Santier,
                required: true
            }]
        });

        let isWithinAnySite = false;
        assignedSites.forEach(site => {
            const distance = haversine(latitudine, longitudine, site.Santier.latitudine, site.Santier.longitudine);
            if (distance <= site.Santier.raza) {
                isWithinAnySite = true;
                idSantier = site.Santier.id;
            }
        });
        if (!isWithinAnySite) {
            return res.status(403).json({ message: "Nu esti in perimetrul niciunui santier asignat." });
        }
        if (type === 'start') {
            const existingPontaj = await Pontaj.findOne({
                where: {
                    idAngajat: idAngajat,
                    start: { [Op.gte]: new Date().setHours(0, 0, 0, 0) },
                    final: null
                }
            });
            if (existingPontaj) {
                return res.status(409).json({ message: 'Pontajul de început a fost deja înregistrat astăzi.' });
            }

            const newPontaj = await Pontaj.create({
                idAngajat,
                idSantier,
                latitudine,
                longitudine,
                start: new Date()
            });
            return res.status(201).json(newPontaj);
        } else if (type === 'final') {
            const pontaj = await Pontaj.findOne({
                where: {
                    idAngajat: idAngajat,
                    final: null
                }
            });
            if (!pontaj) {
                return res.status(404).json({ message: 'Pontajul de început nu a fost găsit pentru înregistrarea finalului sau a fost deja realizat pontajul final .' });
            }
            
            pontaj.final = new Date();
            const durationInMilliseconds = pontaj.final.getTime() - pontaj.start.getTime(); 
            const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
            const seconds = durationInSeconds % 60;
            const totalMinutes = (durationInSeconds - seconds) / 60;
            const minutes = totalMinutes % 60;
            const hours = (totalMinutes - minutes) / 60;
            pontaj.durata = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            await pontaj.save();
            return res.status(200).json(pontaj);
        } else {
            return res.status(400).json({ message: 'Tipul de pontaj specificat este invalid.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getPontajByIdAngajat = async (req, res) => {
    try {
        const { idAngajat } = req.params;
        const pontaje = await Pontaj.findAll({
            where: { idAngajat: idAngajat },
            include: [
                {
                    model: Angajati,
                    attributes: ['nume', 'prenume']
                },
                {
                    model: Santier,
                    attributes: ['nume']
                }
            ]
        });
        if (pontaje.length === 0) {
            return res.status(404).json({ message: 'Nu au fost găsite pontaje pentru acest angajat.' });
        }
        const result = pontaje.map(pontaj => ({
            numeAngajat: `${pontaj.Angajati.nume} ${pontaj.Angajati.prenume}`,
            start: pontaj.start,
            final: pontaj.final,
            durata: pontaj.durata,
            numeSantier: pontaj.Santier.nume
        }));
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    addPontaj,
    verifyToken,
    getPontajByIdAngajat
};
