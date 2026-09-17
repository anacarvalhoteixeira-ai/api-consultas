import {
  buscarPorId,
  criar,
  horarioDoMedicoOcupado,
  listar,
  usuarioPorIdERole,
} from '../models/consultasModel.js';

const consultaNaoEncontrada = (res) => res.status(404).json({ mensagem: 'Consulta não encontrada' });

export const listarConsultas = async (req, res) => {
  try {
    const where =
      req.user.role === 'PACIENTE' ? { pacienteId: req.user.id }
        : req.user.role === 'MEDICO' ? { medicoId: req.user.id }
          : {};
    const consultas = await listar(where);
    return res.status(200).json(consultas);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar consultas' });
  }
};

export const buscarConsulta = async (req, res) => {
  try {
    const consulta = await buscarPorId(req.params.id);
    const semPermissao =
      (req.user.role === 'PACIENTE' && consulta?.pacienteId !== req.user.id)
      || (req.user.role === 'MEDICO' && consulta?.medicoId !== req.user.id);

    if (!consulta || semPermissao) {
      return consultaNaoEncontrada(res);
    }
    return res.status(200).json(consulta);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar consulta' });
  }
};

export const agendarConsulta = async (req, res) => {
  try {
    const { especialidade, dataConsulta } = req.body;
    let { pacienteId, medicoId } = req.body;

    if (req.user.role === 'PACIENTE') {
      pacienteId = req.user.id;
      if (!medicoId) return res.status(400).json({ mensagem: 'Informe o médico da consulta' });
    }
    if (req.user.role === 'MEDICO') {
      medicoId = req.user.id;
      if (!pacienteId) return res.status(400).json({ mensagem: 'Informe o paciente da consulta' });
    }
    if (req.user.role === 'ADMIN' && (!pacienteId || !medicoId)) {
      return res.status(400).json({ mensagem: 'Informe paciente e médico da consulta' });
    }

    const [paciente, medico, horarioOcupado] = await Promise.all([
      usuarioPorIdERole(pacienteId, 'PACIENTE'),
      usuarioPorIdERole(medicoId, 'MEDICO'),
      horarioDoMedicoOcupado(medicoId, dataConsulta),
    ]);

    if (!paciente || !medico) return res.status(400).json({ mensagem: 'Paciente ou médico inválido' });
    if (horarioOcupado) return res.status(409).json({ mensagem: 'O médico já possui consulta neste horário' });

    const consulta = await criar({ pacienteId, medicoId, especialidade, dataConsulta });
    return res.status(201).json(consulta);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao agendar consulta' });
  }
};
