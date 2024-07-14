const router = require("express").Router();
const pontajController = require("../controllers").pontajController;
const { verifyToken } = require("../controllers/pontaj");

router.post("/addPontaj",verifyToken,pontajController.addPontaj);
router.get("/getPontajByIdAngajat/:idAngajat",pontajController.getPontajByIdAngajat);
router.get('/getPontajeBySantier/:idSantier',pontajController.getPontajeBySantier);

module.exports = router;