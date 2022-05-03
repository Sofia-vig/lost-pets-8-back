import { User, Pet, Report } from "../lib/models";

User.sequelize
  .sync({ alter: true })
  .then((res) => console.log(res))
  .catch((e) => console.log(e));

Pet.sequelize
  .sync({ alter: true })
  .then((res) => console.log(res))
  .catch((e) => console.log(e));

Report.sequelize
  .sync({ alter: true })
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
