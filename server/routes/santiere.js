const router = require("express").Router();
const santierController = require("../controllers").santiereController;

router.post("/addSantier", santierController.addSantier);
router.get("/getAllSantiere", santierController.getAllSantiere);
router.post("/asignareSantier", santierController.asignareSantier);
router.post("/updateSantier", santierController.updateSantier);

module.exports = router;