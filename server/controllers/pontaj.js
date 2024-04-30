const Angajati = require('../models').Angajati;
const Pontaj = require('../models').Pontaj;
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


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

        if (type === 'start') {
            const existingPontaj = await Pontaj.findOne({
                where: {
                    idAngajat: idAngajat,
                    start: {
                        [Op.gte]: todayStart,
                        [Op.lt]: todayEnd
                    }
                }
            });

            if (existingPontaj) {
                return res.status(409).json({ message: 'Pontajul de început a fost deja înregistrat astăzi.' });
            }

            const newPontaj = await Pontaj.create({
                idAngajat,
                latitudine,
                longitudine,
                start: new Date() 
            });
            return res.status(201).json(newPontaj);
        } else if (type === 'final') {
            const pontaj = await Pontaj.findOne({
                where: {
                    idAngajat: idAngajat,
                    start: {
                        [Op.gte]: todayStart,
                        [Op.lt]: todayEnd
                    },
                    final: null
                }
            });
            if (!pontaj) {
                return res.status(404).json({ message: 'Pontajul de început nu a fost găsit pentru înregistrarea finalului.' });
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
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addPontaj, // exportă funcția addPontaj
    verifyToken // exportă middleware-ul verifyToken
};
