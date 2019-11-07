module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' }, // definimos uma foreign key, no caso todo 'avatar_id' vai referenciar um 'id' na tabela 'files'
      onUpdate: 'CASCADE', // se for feito update na tabela 'files' o 'CASCADE' ira refletir na tabela 'users'
      onDelete: 'SET NULL', // se o arquivo referenciado for deletado na tabela 'files' vai setar 'null' onde era referenciado na tabela
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
