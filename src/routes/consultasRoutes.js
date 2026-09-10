const express = require('express');
const consultasController = require('../controllers/consultasController');
const {
    criarConsultaSchema,
    idConsultaSchema
} = require('../schemas/consultasSchema');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post(
    '/',
    validate(criarConsultaSchema, 'body'),
    consultasController.agendarConsulta
);

router.get('/', consultasController.listarConsultas);

router.get(
    '/:id',
    validate(idConsultaSchema, 'params'),
    consultasController.buscarConsulta
);

module.exports = router;
