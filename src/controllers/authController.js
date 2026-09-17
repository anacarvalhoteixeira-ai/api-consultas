import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';

const dadosPublicos = ({ id, nome, email, role }) => ({ id, nome, email, role });

const salvarUsuario = async ({ nome, email, password, role }) => {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.usuario.create({ data: { nome, email, password: passwordHash, role } });
};

const responderErroCadastro = (erro, res) => {
  if (erro.code === 'P2002') return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado' });
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
};

export const register = async (req, res) => {
  try {
    const usuario = await salvarUsuario({ ...req.body, role: 'PACIENTE' });
    return res.status(201).json({ mensagem: 'Paciente cadastrado com sucesso', usuario: dadosPublicos(usuario) });
  } catch (erro) {
    return responderErroCadastro(erro, res);
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const usuario = await salvarUsuario(req.body);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', usuario: dadosPublicos(usuario) });
  } catch (erro) {
    return responderErroCadastro(erro, res);
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, role: true },
      orderBy: { nome: 'asc' },
    });
    return res.status(200).json(usuarios);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ role: usuario.role }, process.env.JWT_SECRET, {
      subject: String(usuario.id),
      expiresIn: '1h',
    });

    return res.status(200).json({ token, usuario: dadosPublicos(usuario) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao realizar login' });
  }
};
