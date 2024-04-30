const router = require("express").Router();
const pontajController = require("../controllers").pontajController;
const { verifyToken } = require("../controllers/pontaj");

router.post("/addPontaj",verifyToken,pontajController.addPontaj);

module.exports = router;