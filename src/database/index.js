import Sequelize from 'sequelize'; // responsavel pela conexao com o banco
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // vai fazer a conexao com o db e carregar os models
  init() {
    this.connection = new Sequelize(databaseConfig);

    // vai iterar por todos os models e rodar o init de cada um
    models
      .map(model => model.init(this.connection))
      // so ira executar o metodo 'associate' caso ele esteja declarado, por isso o 'model.associate' antes de chamar o mesmo passando os models
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
