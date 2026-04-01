import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/db';

class User extends Model {
  declare id: number;
  declare name: string;
  declare avatar: string | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, allowNull: true }
  },
  { sequelize, tableName: 'users' }
);

export default User;
