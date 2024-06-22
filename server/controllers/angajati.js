const Angajati = require('../models').Angajati;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Mailgun = require('mailgun-js');
const Joi = require('@hapi/joi');

// const validareAngajat = async (angajatBody) => {
//     const errors = [];
//     const requiredFields = ['nume', 'prenume', 'cnp', 'dataAngajare', 'numarTelefon', 'parola', 'email'];
//     requiredFields.forEach(field => {
//         if (!angajatBody[field]) {
//             errors.push(`${field} trebuie completat.`);
//         }
//     });
//     if (angajatBody.email && !/\S+@\S+\.\S+/.test(angajatBody.email)) {
//         errors.push('Formatul email-ului este incomplet.');
//     }
//     if (angajatBody.cnp && !/^\d{13}$/.test(angajatBody.cnp)) {
//         errors.push('CNP-ul trebuie sa aiba 13 caractere.');
//     }
//     if (angajatBody.numarTelefon && !/^\d{10}$/.test(angajatBody.numarTelefon)) {
//         errors.push('Numarul de telefon trebuie sa fie de 10 caractere.');
//     }
//     if (angajatBody.parola && angajatBody.parola.length < 1) {
//         errors.push('Parola trebuie adaugata.');
//     }
//     return errors;
// }

const schema = Joi.object({
    nume: Joi.string().required(),
    prenume: Joi.string().required(),
    cnp: Joi.string().length(13).pattern(/^\d+$/).required(),
    dataAngajare: Joi.date().required(),
    numarTelefon: Joi.string().required().length(10),
    email: Joi.string().email().required(),
    isAdmin: Joi.boolean().valid(true),
    parola: Joi.string().required(),
});


const controller = {
    addAngajat: async (req, res) => {
        try {
         const userBody = {
            nume: req.body.nume,
            prenume: req.body.prenume,
            cnp: req.body.cnp,
            dataAngajare: req.body.dataAngajare,
            numarTelefon: req.body.numarTelefon,
            isAdmin: req.body.isAdmin,
            parola: req.body.parola,
            email: req.body.email,
         }
        const { error } = schema.validate(userBody, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ message: errorMessages });
        }
        const emailExists = await Angajati.findOne({ where: { email: userBody.email } });
        if (emailExists) {
            return res.status(400).json({ message: 'Email-ul este deja folosit.' });
        }
        const cnpExists = await Angajati.findOne({ where: { cnp: userBody.cnp } });
        if (cnpExists) {
            return res.status(400).json({ message: 'CNP-ul este deja folosit.' });
        }
        const parolaBycrypt = await bcrypt.hash(userBody.parola, 10);
        userBody.parola = parolaBycrypt;
        await Angajati.create(userBody);
        res.status(201).json({
            message: `Angajat adăugat cu succes!`,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
},
    getAllAngajati: async (req, res) => {
        try {
            const angajati = await Angajati.findAll();
            res.status(200).json(angajati);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },
   login: async (req, res) => {
        try {
            const email = req.body.email;
            const parola = req.body.parola;
            const angajat = await Angajati.findOne({ where: { email: email } });
            if (!angajat) {
                return res.status(404).json({ message: 'Email sau parola incorecte.' });
            }
            const valid = await bcrypt.compare(parola, angajat.parola);
            if (!valid) {
                return res.status(404).json({ message: 'Email sau parola incorecte.' });
            }
            if (valid) {
                jwt.sign(
                    angajat.get(),
                    process.env.JWT_KEY,
                    {
                        algorithm: "HS256",
                    },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            throw new Error("jwt");
                        }
                        res.cookie("bearer", token, {
                            httpOnly: true,
                            expire: process.env.COOKIE_AGE,
                        });
                        res.status(200).send({ angajat: angajat, token: token });
                    }
                );
            } else {
                res.status(403).send("Email sau parola gresita!");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    },
    update: async (req, res) => {
        try {
            const angajat = await Angajati.findOne({ where: { idAngajat: req.body.idAngajat } });
            if (angajat) {
                angajat.nume = req.body.nume;
                angajat.prenume = req.body.prenume;
                angajat.cnp = req.body.cnp;
                angajat.dataAngajare = req.body.dataAngajare;
                angajat.numarTelefon = req.body.numarTelefon;
                angajat.isAdmin = req.body.isAdmin;
                angajat.parola = req.body.parola;
                angajat.email = req.body.email;
                await angajat.save();
                res.status(200).json({ message: 'Angajat actualizat cu succes!' });
            } else {
                res.status(404).json({ message: 'Angajatul nu a fost gasit!' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    sendPasswordEmail: async (req, res) => {
        const email = req.body.email;
        const parola = req.body.parola;
        Mailgun()
        .messages().send(
            {
                from:"John Doe <jd@jd.com>",
                to:`${email}`,
                subject:"Parola MEPontaj",
                html:`<p>Parola ta este: ${parola}</p>`,
        },
        (error, body) => {
            if (error) {
              console.log(error);
              res.status(500).send({ message: "Error in sending email" });
            } else {
              console.log(body);
              res.send({ message: "Email sent successfully" });
            }
        }
    )}
}
module.exports = controller; 