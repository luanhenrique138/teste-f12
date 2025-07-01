import db from '../../models/index.js';
const { Programa } = db;


class ProgramaController {
    static async index(req, res) {
        try {
            const programas = await Programa.findAll();
            if (!programas.length) {
                return res.json({ message: "Nenhum programa cadastrado" });
            }
            return res.json(programas);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: 'Erro ao buscar os programas', details: error.message });
        }
    }
}

export default ProgramaController;