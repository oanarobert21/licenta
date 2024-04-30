const databaseController = require("./database");
const angajatiController = require("./angajati");
const santiereController = require("./santiere"); 
const pontajController = require("./pontaj");

const controllers={
    databaseController,
    angajatiController,
    santiereController,
    pontajController
}

module.exports= controllers;