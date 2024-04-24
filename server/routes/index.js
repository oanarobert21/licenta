const router = require("express").Router();

const databaseRouter = require("./database");
const angajatiRouter= require("./angajati");
const santiereRouter = require("./santiere"); 

router.use("/database",databaseRouter);
router.use("/angajati",angajatiRouter);
router.use("/santiere",santiereRouter);

module.exports= router;