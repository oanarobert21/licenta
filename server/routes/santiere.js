const router = require("express").Router();
const santierController = require("../controllers").santiereController;

router.post("/addSantier", santierController.addSantier);
router.get("/getAllSantiere", santierController.getAllSantiere);

module.exports = router;