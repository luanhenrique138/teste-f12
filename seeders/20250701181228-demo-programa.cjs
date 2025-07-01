'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Programas', [
      {
        nome: 'Programa de Abertura',
        descricao: 'Programa inaugural da grade de programação.',
        dataExibicao: '2025-07-02',
        horarioInicio: '08:00',
        horarioTermino: '09:00',
        imagemCapa: '', // pode ser base64 ou string vazia
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Programas', null, {});
  }
};
