import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/db';

class DailyQuestion extends Model {
  declare questionId: number;
  declare groupId: number;
  declare date: Date;
}

DailyQuestion.init(
  {
    questionId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    groupId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    date: { type: DataTypes.DATEONLY, allowNull: false }
  },
  { sequelize, tableName: 'daily_questions' }
);

export default DailyQuestion;
