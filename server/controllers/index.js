const databaseController = require("./database");
const angajatiController = require("./angajati");
const santiereController = require("./santiere"); 
const pontajController = require("./pontaj");
const concediiController = require("./concedii");

const controllers={
    databaseController,
    angajatiController,
    santiereController,
    pontajController,
    concediiController
}

module.exports= controllers;