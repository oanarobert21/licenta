const router = require("express").Router();

const databaseRouter = require("./database");
//const angataiRouter= require("./angajati");

router.use("/database",databaseRouter);
//router.use("/user", angataiRouter);

module.exports= router;