const Santier = require('../models').Santier;
const Angajati = require('../models').Angajati;
const AngajatiSantiere = require('../models').AngajatiSantiere;
const Joi = require('@hapi/joi');

const validareSantier = async (santierBody) => {
    const errors = [];
    const requiredFields = ['nume', 'latitudine', 'longitudine', 'raza', 'localitate', 'judet', 'adresa'];
    requiredFields.forEach(field => {
        if (!santierBody[field]) {
            errors.push(`${field} trebuie completat.`);
        }
    });
    return errors;
}

const schema = Joi.object({
    nume: Joi.string().required(),
    latitudine: Joi.number().required(),
    longitudine: Joi.number().required(),
    raza: Joi.number().required(),
    localitate: Joi.string().required(),
    judet: Joi.string().required(),
    adresa: Joi.string().required()
});

const controller = {
    addSantier: async (req, res) => {
        try{
            const santierBody = {
                nume: req.body.nume,
                latitudine: req.body.latitudine,
                longitudine: req.body.longitudine,
                raza: req.body.raza,
                localitate: req.body.localitate,
                judet: req.body.judet,
                adresa: req.body.adresa
            }
            const errors = schema.validate(santierBody, { abortEarly: false }).error;
            if (!errors) {
               await Santier.create(santierBody);
               res.status(201).json({
                   message: `Santier adaugat cu succes!`,
               });
           } else {
                   res.status(400).json({ message: errors });
               }
        } 
        catch(err){
            res.status(500).json({message: 'Santier adăugat deja în baza de date.'});
        }
    },
    getAllSantiere: async (req, res) => {
        try{
            const santiere = await Santier.findAll();
            res.status(200).json(santiere);
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    },
    asignareSantier: async (req, res) => {
        const { idAngajat, idSantiere } = req.body; 
        try {
        if (!idAngajat || !idSantiere || !idSantiere.length) {
            return res.status(400).json({ message: "Informatii insuficiente pentru a asigna angajatul." });
        }
        const angajat = await Angajati.findByPk(idAngajat);
        if (!angajat) {
            return res.status(404).json({ message: "Angajatul nu a fost găsit." });
        }
        for (const idSantier of idSantiere) {
            const santier = await Santier.findByPk(idSantier);
            if (!santier) {
                return res.status(404).json({ message: `Santierul cu ID-ul ${idSantier} nu există.` });
            }
        }
        const assignments = idSantiere.map(idSantier => ({
            idAngajat: idAngajat,
            idSantier: idSantier
        }));
        await AngajatiSantiere.bulkCreate(assignments);
        res.status(201).json({
            message: "Angajatul a fost asignat cu succes la șantierele selectate."
        });
    } catch (error) {
        console.error('Eroare la asignarea angajatului la șantiere:', error);
        res.status(500).json({ message: error.message });
    }
    },
    updateSantier: async (req, res) => {
        const santier = await Santier.findOne({ where: { id: req.body.id} });
        if (santier) {
            santier.nume = req.body.nume;
            santier.latitudine=req.body.latitudine;
            santier.longitudine=req.body.longitudine;
            santier.raza=req.body.raza;
            santier.localitate=req.body.localitate;
            santier.judet=req.body.judet;
            santier.adresa=req.body.adresa;
            await santier.save();
            res.status(200).json({ message: 'Santier actualizat cu succes!' });
        } else {
            res.status(404).json({ message: 'Santierul nu a fost gasit!' });
        }
    }
}

module.exports = controller;