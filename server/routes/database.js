const router = require("express").Router();
const databaseController = require("../controllers").databaseController;

router.get("/sync", databaseController.sync);

module.exports = router;
