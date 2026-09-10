const consultasModel = require("../models/consultasModel");

const listarConsultas = async (req, res) =>{
    try {
        const consultas = await consultasModel.buscarTodos();

        res.status(200).json(consultas)
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao buscar consultas"
        })
    };
}

const buscarConsulta = async (req, res) => {
    try {
        const id = req.params.id;

        const consulta = await consultasModel.buscarPorId(id);

        if(!consulta) {
            return res.status(404).json({
                mensagem: "Consulta não encontrada"
            })
        }

        res.status(200).json(consulta)
    } catch (erro) {
        console.error(erro)

        res.status(500).json({
            mensagem: "Erro ao buscar consulta"
        })
    }
}

const agendarConsulta = async (req, res) => {
    try {
        const { id, paciente, medico, especialidade } = req.body;
       
        const novaConsulta = await consultasModel.criar({
            id,
            paciente,
            medico,
            especialidade
        });

        res.status(201).json(novaConsulta);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao agendar consulta"
        })
    }
};

module.exports = {
    listarConsultas,
    buscarConsulta,
    agendarConsulta
};