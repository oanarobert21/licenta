const router = require("express").Router();
const angajatiController = require("../controllers").angajatiController;

router.post("/addAngajat", angajatiController.addAngajat);
router.get("/getAllAngajati", angajatiController.getAllAngajati);
router.post("/login", angajatiController.login);
router.post("/update", angajatiController.update);

module.exports = router;