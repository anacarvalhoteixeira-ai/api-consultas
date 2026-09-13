const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email('Informe um e-mail válido'),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
    role: z.enum(['PACIENTE', 'MEDICO', 'ADMIN'])
});

const loginSchema = z.object({
    email: z.string().email('Informe um e-mail válido'),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres')
});

module.exports = {
    registerSchema,
    loginSchema
};
