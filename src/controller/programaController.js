import { Op } from 'sequelize';
import db from '../../models/index.js';
import * as Yup from 'yup';

const { Programa } = db;


const programaSchema = Yup.object().shape({
    nome: Yup.string().required('Nome é obrigatório'),
    descricao: Yup.string().required('Descrição é obrigatória'),
    dataExibicao: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data de exibição deve estar no formato YYYY-MM-DD')
        .required('Data de exibição é obrigatória'),
    horarioInicio: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário de início deve estar no formato HH:mm')
        .required('Horário de início é obrigatório'),
    horarioTermino: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário de término deve estar no formato HH:mm')
        .required('Horário de término é obrigatório'),
    imagemCapa: Yup.string()
        .optional()
        .test('is-base64-jpg-png', 'Imagem de capa deve ser base64 jpg ou png', value => {
            if (!value) return true;
            return (
                value.startsWith('data:image/jpeg;base64,') ||
                value.startsWith('data:image/png;base64,')
            );
        }),
}).test('horario-valido', 'Horário de término deve ser maior que o horário de início', function (values) {
    const { horarioInicio, horarioTermino } = values;

    if (!horarioInicio || !horarioTermino) return true;

    const [hIni, mIni] = horarioInicio.split(':').map(Number);
    const [hFim, mFim] = horarioTermino.split(':').map(Number);

    const inicioMinutos = hIni * 60 + mIni;
    const fimMinutos = hFim * 60 + mFim;

    return fimMinutos > inicioMinutos;
});


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

    static async store(req, res) {
        try {
            let imagemCapaBase64 = '';
            if (req.file) {

            }
            if (req.file) {

                const { mimetype, size } = req.file;

                const tiposPermitidos = ['image/jpeg', 'image/png'];
                const tamanhoMaximo = 5 * 1024 * 1024; // 5MB

                if (!tiposPermitidos.includes(mimetype)) {
                    return res.status(400).json({
                        error: 'Tipo de imagem inválido. Apenas .jpg e .png são permitidos.',
                    });
                }

                if (size > tamanhoMaximo) {
                    return res.status(400).json({
                        error: 'Imagem muito grande. O tamanho máximo permitido é 5MB.',
                    });
                }

                const base64 = req.file.buffer.toString('base64');
                imagemCapaBase64 = `data:${mimetype};base64,${base64}`;
            }

            const dataToValidate = {
                ...req.body,
                imagemCapa: imagemCapaBase64 || req.body.imagemCapa || '',
            };

            await programaSchema.validate(dataToValidate, { abortEarly: false });

            const {
                dataExibicao,
                horarioInicio,
                horarioTermino,
            } = dataToValidate;

            const conflito = await Programa.findOne({
                where: {
                    dataExibicao,
                    horarioInicio: {
                        [Op.lt]: horarioTermino,
                    },
                    horarioTermino: {
                        [Op.gt]: horarioInicio,
                    }
                }
            });

            if (conflito) {
                return res.status(409).json({
                    error: 'Conflito de horário',
                    message: 'Já existe um programa cadastrado nesse horário',
                });
            }

            const programa = await Programa.create(dataToValidate);
            return res.status(201).json(programa);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ erros: error.errors });
            }
            console.error(error);
            return res.status(500).json({ error: 'Erro ao cadastrar programa', details: error.message });
        }
    }

    static async show(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const programa = await Programa.findByPk(id);

            if (!programa) {
                return res.status(404).json({ error: 'Programa não encontrado' });
            }

            return res.status(200).json(programa);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar o programa', details: error.message });
        }
    }

    static async destroy(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const programa = await Programa.findByPk(id);

            if (!programa) {
                return res.status(404).json({ error: 'Programa não encontrado' });
            }

            await programa.destroy();

            return res.status(200).json({ message: 'Programa deletado com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao deletar programa', details: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const programa = await Programa.findByPk(id);
            if (!programa) {
                return res.status(404).json({ error: 'Programa não encontrado' });
            }

            // Validação de imagem (se enviada)
            let imagemCapaBase64 = programa.imagemCapa; // mantém a anterior como default

            if (req.file) {
                const { mimetype, size } = req.file;

                const tiposPermitidos = ['image/jpeg', 'image/png'];
                const tamanhoMaximo = 5 * 1024 * 1024; // 5MB

                if (!tiposPermitidos.includes(mimetype)) {
                    return res.status(400).json({
                        error: 'Tipo de imagem inválido. Apenas .jpg e .png são permitidos.',
                    });
                }

                if (size > tamanhoMaximo) {
                    return res.status(400).json({
                        error: 'Imagem muito grande. O tamanho máximo permitido é 5MB.',
                    });
                }

                const base64 = req.file.buffer.toString('base64');
                imagemCapaBase64 = `data:${mimetype};base64,${base64}`;
            }

            // Dados combinados
            const dataToValidate = {
                ...req.body,
                imagemCapa: imagemCapaBase64 || '',
            };

            // Validação
            await programaSchema.validate(dataToValidate, { abortEarly: false });

            const { dataExibicao, horarioInicio, horarioTermino } = dataToValidate;

            // Conflito de horário (ignora o próprio ID)
            const conflito = await Programa.findOne({
                where: {
                    id: { [Op.ne]: id },
                    dataExibicao,
                    horarioInicio: {
                        [Op.lt]: horarioTermino,
                    },
                    horarioTermino: {
                        [Op.gt]: horarioInicio,
                    }
                }
            });

            if (conflito) {
                return res.status(409).json({
                    error: 'Conflito de horário',
                    message: 'Já existe um programa cadastrado nesse horário',
                });
            }

            // Atualiza
            await programa.update(dataToValidate);
            return res.status(200).json(programa);

        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ erros: error.errors });
            }
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar programa', details: error.message });
        }
    }




}

export default ProgramaController;