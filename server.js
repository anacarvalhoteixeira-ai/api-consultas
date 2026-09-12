require('dotenv').config();

const express = require('express');
const consultasRoutes = require("./src/routes/consultasRoutes")
const authRoutes = require('./src/routes/authRoutes');

const app = express()
const PORTA = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) =>{
    res.json({
        mensagem: "Sistema de Gestão de Consultas ativo"
    })
});

app.use("/consultas", consultasRoutes);
app.use('/auth', authRoutes);


app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
});
