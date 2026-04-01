import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/db';

class Answer extends Model {
  declare id: number;
  declare questionId: number;
  declare userFromId: number;
  declare userTargetId: number | null;
  declare groupId: number;
  declare date: Date;
  declare isAnonymous: boolean;
}

Answer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    questionId: { type: DataTypes.INTEGER, allowNull: false },
    userFromId: { type: DataTypes.INTEGER, allowNull: false },
    userTargetId: { type: DataTypes.INTEGER, allowNull: true },
    groupId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    isAnonymous: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  { sequelize, tableName: 'answers' }
);

export default Answer;
