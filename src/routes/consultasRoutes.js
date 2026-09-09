const consultasController = require("../controllers/consultasController")

const express = require('express');

const router = express.Router();


router.get("/", consultasController.listarConsultas)

router.get("/:id", consultasController.buscarConsulta)

router.post("/", consultasController.agendarConsulta)

module.exports = router;