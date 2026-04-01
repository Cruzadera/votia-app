import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/db';

class Question extends Model {
  declare id: number;
  declare text: string;
  declare type: 'random' | 'custom';
}

Question.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('random', 'custom'), allowNull: false, defaultValue: 'random' }
  },
  { sequelize, tableName: 'questions' }
);

export default Question;
