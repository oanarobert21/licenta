const Concedii = require('../models').Concedii;
const Angajati = require('../models').Angajati;
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const schema = Joi.object({
    idAngajat: Joi.number().required(),
    tipConcediu: Joi.string().required(),
    dataInceput: Joi.date().required(),
    dataSfarsit: Joi.date().required(),
    motiv: Joi.string().required(),
    status: Joi.string().required()
});

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

const controller = {
    addConcediu : async (req, res) => {
        const { tipConcediu, dataInceput, dataSfarsit, motiv, status } = req.body;
        const idAngajat = req.user.idAngajat;
        const concediuBody = {
            idAngajat,
            tipConcediu,
            dataInceput,
            dataSfarsit,
            motiv,
            status
        };
        try {
            const errors = schema.validate(concediuBody, { abortEarly: false }).error;
            if (errors) {
                return res.status(400).json({ message: errors });
            }
            await Concedii.create(concediuBody);
            res.status(201).json({ message: "Concediu adăugat cu succes!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Eroare internă a serverului" });
        }
    },
    getAllConcedii: async (req, res) => {
        try {
            const concedii = await Concedii.findAll({
                include: [
                    {
                        model: Angajati,
                        attributes: ['nume', 'prenume']
                    }
                ]
            });
            res.status(200).json(concedii);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Eroare internă a serverului" });
        }
    },
    updateConcediu: async(req, res) => {
        const {id} = req.params;
        const {status} = req.body;
        try{
            const concediu = await Concedii.findByPk(id);
            if(concediu){
                concediu.status = status;
                await concediu.save();
                res.status(200).json({message: "Concediul a fost actualizat cu succes"});
            } else {
                res.status(404).json({message: "Concediul nu a fost gasit"});
            
            }
        } catch(err){
            console.error(err);
            res.status(500).json({message: "Eroare interna a serverului"});
        }
    },
    getConcediuByIdAngajat: async (req, res) => {
        const { idAngajat } = req.params;
        try {
            const concedii = await Concedii.findAll({
                where: {
                    idAngajat
                }
            });
            if (concedii.length === 0) {
                return res.status(404).json({ message: 'Nu au fost găsite concedii pentru acest angajat.' });
            }
            res.status(200).json(concedii);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Eroare internă a serverului" });
        }
    }
}

module.exports = {
    addConcediu: controller.addConcediu,
    getAllConcedii: controller.getAllConcedii,
    updateConcediu: controller.updateConcediu,
    getConcediuByIdAngajat: controller.getConcediuByIdAngajat,
    verifyToken
}