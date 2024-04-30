const router = require("express").Router();

const databaseRouter = require("./database");
const angajatiRouter= require("./angajati");
const santiereRouter = require("./santiere"); 
const pontajRouter = require("./pontaj");

router.use("/database",databaseRouter);
router.use("/angajati",angajatiRouter);
router.use("/santiere",santiereRouter);
router.use("/pontaj",pontajRouter);

module.exports= router;