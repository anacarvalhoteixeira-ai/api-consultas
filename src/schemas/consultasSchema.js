import { z } from 'zod';

const id = z.coerce.number().int().positive();

export const criarConsultaSchema = z.object({
  pacienteId: id.optional(),
  medicoId: id.optional(),
  especialidade: z.string().trim().min(3).max(100),
  dataConsulta: z.coerce.date().refine((data) => data > new Date(), 'A consulta deve estar no futuro'),
}).strict();

export const idConsultaSchema = z.object({ id });
