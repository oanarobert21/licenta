const Santier = require('../models').Santier;

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
            const errors = await validareSantier(santierBody);
            if (errors.length === 0) {
               await Santier.create(santierBody);
               res.status(201).json({
                   message: `Santier adaugat cu succes!`,
               });
           } else {
                   res.status(400).json({ message: errors });
               }
        } 
        catch(err){
            res.status(500).json({message: err.message});
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
    }
}

module.exports = controller;