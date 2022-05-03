import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "jubjvbaewrlrup",
  password: "629610b03f5447f95f93f78fced492d6a0923c202e37968144db1f6d0f66b0d9",
  database: "dcu7r9q9ucs3j1",
  port: 5432,
  host: "ec2-52-86-56-90.compute-1.amazonaws.com",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
