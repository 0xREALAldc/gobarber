import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // utilizamos o tipo virtual para quando um campo vai existir somente no codigo e nao na tabela do db
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // models refere-se a todos os models da aplicacao
  static associate(models) {
    // belongsTo -> quer dizer que ele pertence a um model file, no caso que o id de um File sera armazenado aqui no User
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  chechPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
