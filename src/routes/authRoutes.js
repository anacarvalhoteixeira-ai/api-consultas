import express from 'express';
import { criarUsuario, login, register } from '../controllers/authController.js';
import { criarUsuarioSchema, registerSchema, loginSchema } from '../schemas/authSchema.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import autorizarCargos from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validate.js';

const router = express.Router();
router.post('/register', validate(registerSchema, 'body'), register);
router.post('/login', validate(loginSchema, 'body'), login);
router.post('/usuarios', authMiddleware, autorizarCargos('ADMIN'), validate(criarUsuarioSchema, 'body'), criarUsuario);

export default router;
