const express = require('express');
const consultasController = require('../controllers/consultasController');
const {
    criarConsultaSchema,
    idConsultaSchema
} = require('../schemas/consultasSchema');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/authMiddleware');
const autorizarCargos = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    autorizarCargos('ADMIN', 'MEDICO'),
    validate(criarConsultaSchema, 'body'),
    consultasController.agendarConsulta
);

router.get('/', authMiddleware, consultasController.listarConsultas);

router.get(
    '/:id',
    authMiddleware,
    validate(idConsultaSchema, 'params'),
    consultasController.buscarConsulta
);

module.exports = router;
