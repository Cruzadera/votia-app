import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/db';

class Group extends Model {
  declare id: number;
  declare name: string;
  declare inviteCode: string;
}

Group.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    inviteCode: { type: DataTypes.STRING, allowNull: false, unique: true }
  },
  { sequelize, tableName: 'groups' }
);

export default Group;
