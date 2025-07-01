import { Model, DataTypes } from 'sequelize';

// A função que define o modelo agora é exportada como padrão (default export)
export default (sequelize) => {
  class Programa extends Model {
    static associate(models) {
      // associações, se houver
    }
  }

  Programa.init({
    // As definições dos campos permanecem as mesmas
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    dataExibicao: DataTypes.DATEONLY,
    horarioInicio: DataTypes.TIME,
    horarioTermino: DataTypes.TIME,
    imagemCapa: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Programa',
  });

  return Programa;
};
