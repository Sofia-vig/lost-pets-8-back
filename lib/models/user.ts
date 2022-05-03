import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db";

export class User extends Model {}
User.init(
  {
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
