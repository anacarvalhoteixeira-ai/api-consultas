const consultas = [
  {
    "id": 1,
    "paciente": "Carlos Silva",
    "medico": "Dr. Arnaldo Ribeiro",
    "especialidade": "Clínica Médica",
  },
  {
    "id": 2,
    "paciente": "Mariana Souza",
    "medico": "Dra. Ana Beatriz Costa",
    "especialidade": "Pediatria",
  },
  {
    "id": 3,
    "paciente": "Roberto Oliveira",
    "medico": "Dr. Arnaldo Ribeiro",
    "especialidade": "Clínica Médica",
  }
]

module.exports = {
    buscarTodos: () => {
        return consultas;
    }, 
    buscarPorId: (id) => {
        return consultas.find(consulta => consulta.id === id);
    },
    criar: (consulta) => {
        consultas.push(consulta);
        return consulta
    },
    deletar: (id) => {
    const indice = consultas.findIndex(consulta => consulta.id === id);

    if (indice === -1) {
        return null;
    }

    return consultas.splice(indice, 1)[0];
}
};