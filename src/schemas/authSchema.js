import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Informe um e-mail válido');
const password = z.string().min(8, 'A senha deve conter pelo menos 8 caracteres').max(72);
const nome = z.string().trim().min(3, 'Informe o nome completo').max(150);

export const registerSchema = z.object({ nome, email, password }).strict();
export const criarUsuarioSchema = z.object({
  nome,
  email,
  password,
  role: z.enum(['PACIENTE', 'MEDICO', 'ADMIN']),
}).strict();
export const loginSchema = z.object({ email, password: z.string().min(1, 'Informe a senha') }).strict();
