import prisma from '../../prisma/client.js';

const includeUsuarios = {
  paciente: { select: { id: true, nome: true, email: true } },
  medico: { select: { id: true, nome: true, email: true } },
};

export const listar = (where = {}) => prisma.consulta.findMany({
  where,
  include: includeUsuarios,
  orderBy: { dataConsulta: 'asc' },
});

export const buscarPorId = (id) => prisma.consulta.findUnique({
  where: { id },
  include: includeUsuarios,
});

export const criar = (data) => prisma.consulta.create({ data, include: includeUsuarios });

export const usuarioPorIdERole = (id, role) => prisma.usuario.findFirst({
  where: { id, role },
  select: { id: true },
});

export const horarioDoMedicoOcupado = (medicoId, dataConsulta) => prisma.consulta.findFirst({
  where: { medicoId, dataConsulta },
  select: { id: true },
});
