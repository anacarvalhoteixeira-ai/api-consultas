import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from './client.js';

const { ADMIN_NOME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_NOME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('Defina ADMIN_NOME, ADMIN_EMAIL e ADMIN_PASSWORD antes de executar o seed');
}

const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
await prisma.usuario.upsert({
  where: { email: ADMIN_EMAIL.trim().toLowerCase() },
  update: {},
  create: { nome: ADMIN_NOME.trim(), email: ADMIN_EMAIL.trim().toLowerCase(), password, role: 'ADMIN' },
});

await prisma.$disconnect();
console.log('Administrador inicial pronto.');
