import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db";

export class Report extends Model {}
Report.init(
  {
    reporter_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    message: DataTypes.STRING,
    petId: DataTypes.INTEGER,
  },
  { sequelize, modelName: "report" }
);
