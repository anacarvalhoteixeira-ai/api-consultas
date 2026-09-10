const { z } = require('zod');

const criarConsultaSchema = z.object({
    id: z.number().positive('O id deve ser maior que zero'),
    paciente: z.string().min(3, 'O nome do paciente deve conter no mínimo 3 caracteres'),
    medico: z.string().min(3, 'O nome do medico deve conter no mínimo 3 caracteres'),
    especialidade: z.string().min(3, 'A especialidade deve conter no mínimo 3 caracteres')
});

const idConsultaSchema = z.object({
    id: z.coerce.number().int().positive()
});

module.exports = {
    criarConsultaSchema,
    idConsultaSchema
};
