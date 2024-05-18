const router = require("express").Router();
const concediiController = require("../controllers").concediiController;
const { verifyToken } = require("../controllers/concedii");

router.post("/addConcediu", verifyToken,concediiController.addConcediu);
router.get("/getAllConcedii",concediiController.getAllConcedii);
router.post("/updateConcediu/:id",concediiController.updateConcediu);
router.get("/getConcediuByIdAngajat/:idAngajat", verifyToken, concediiController.getConcediuByIdAngajat);

module.exports = router;