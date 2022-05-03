import { User } from "./user";
import { Pet } from "./pet";
import { Report } from "./report";

//Una mascota es publicada por un solo user
// Pet.belongsTo(User);
//Un usuario puede haber publicado varias mascotas (re irresponsable ahr)
// User.hasMany(Pet);
//Un reporte es de una mascota sola
// Report.belongsTo(Pet);
//La mascota puede tener varios reportes de que la vieron
// Pet.hasMany(Report);

export { User, Pet, Report };
