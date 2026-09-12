const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarios = [
    {
        id: 1,
        email: 'paciente@email.com',
        password: '$2b$10$10HZ0D72pAzwVX7.wXPZe.IoyibIbWx9h2IBMDtNqayeJVuzHSe16',
        role: 'PACIENTE'
    },
    {
        id: 2,
        email: 'medico@email.com',
        password: '$2b$10$10HZ0D72pAzwVX7.wXPZe.IoyibIbWx9h2IBMDtNqayeJVuzHSe16',
        role: 'MEDICO'
    },
    {
        id: 3,
        email: 'admin@email.com',
        password: '$2b$10$10HZ0D72pAzwVX7.wXPZe.IoyibIbWx9h2IBMDtNqayeJVuzHSe16',
        role: 'ADMIN'
    }
];

const register = async (req, res) => {
    const { email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    usuarios.push({
        id: usuarios.length + 1,
        email,
        password: passwordHash,
        role
    });

    return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso'
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const usuario = usuarios.find((user) => user.email === email);

    if (!usuario) {
        return res.status(401).json({
            mensagem: 'Credenciais inválidas'
        });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);

    if (!senhaValida) {
        return res.status(401).json({
            mensagem: 'Credenciais inválidas'
        });
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
};

module.exports = {
    register,
    login
};
