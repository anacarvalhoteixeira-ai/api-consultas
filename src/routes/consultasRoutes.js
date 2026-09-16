import express from 'express';
import { agendarConsulta, buscarConsulta, listarConsultas } from '../controllers/consultasController.js';
import { criarConsultaSchema, idConsultaSchema } from '../schemas/consultasSchema.js';
import validate from '../middlewares/validate.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import autorizarCargos from '../middlewares/roleMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', listarConsultas);
router.get('/:id', validate(idConsultaSchema, 'params'), buscarConsulta);
router.post('/', autorizarCargos('ADMIN', 'MEDICO', 'PACIENTE'), validate(criarConsultaSchema, 'body'), agendarConsulta);

export default router;
