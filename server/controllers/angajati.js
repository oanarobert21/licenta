const Angajati = require('../models').Angajati;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mg = require('mailgun-js');
const Mailgun = require('mailgun-js');

const validareAngajat = async (angajatBody) => {
    const errors = [];
    const requiredFields = ['nume', 'prenume', 'cnp', 'dataAngajare', 'numarTelefon', 'parola', 'email'];
    requiredFields.forEach(field => {
        if (!angajatBody[field]) {
            errors.push(`${field} trebuie completat.`);
        }
    });
    // Validate specific formats
    if (angajatBody.email && !/\S+@\S+\.\S+/.test(angajatBody.email)) {
        errors.push('Formatul email-ului este incomplet.');
    }

    if (angajatBody.cnp && !/^\d{13}$/.test(angajatBody.cnp)) {
        errors.push('CNP-ul trebuie sa aiba 13 caractere.');
    }

    if (angajatBody.numarTelefon && !/^\d{10}$/.test(angajatBody.numarTelefon)) {
        errors.push('Numarul de telefon trebuie sa fie de 10 caractere.');
    }
    // Password strength validation could also be added here
    if (angajatBody.parola && angajatBody.parola.length < 1) {
        errors.push('Parola trebuie adaugata.');
    }
    // Check if the email is already in use
    const emailExists = await Angajati.findOne({ where: { email: angajatBody.email } });
    if (emailExists) {
        errors.push('Email-ul este deja folosit.');
    }
    // Check if the CNP is already in use
    const cnpExists = await Angajati.findOne({ where: { cnp: angajatBody.cnp } });
    if (cnpExists) {
        errors.push('CNP-ul este deja folosit.');
    }
    return errors;
}

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
            // token: req.body.token
         }
         const errors = await validareAngajat(userBody);
         if (errors.length === 0) {
            const parolaBycrypt = await bcrypt.hash(userBody.parola, 10);
            userBody.parola = parolaBycrypt;
            await Angajati.create(userBody);
            res.status(201).json({
                message: `Angajat adaugat cu succes!`,
            });
        } else {
                res.status(400).json({ message: errors });
            }
        } catch (err) {
            res.status(500).json({message: err.message});
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