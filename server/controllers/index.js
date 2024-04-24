const databaseController = require("./database");
const angajatiController = require("./angajati");
const santiereController = require("./santiere"); 

const controllers={
    databaseController,
    angajatiController,
    santiereController
}

module.exports= controllers;