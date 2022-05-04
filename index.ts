//Express
import * as express from "express";
import * as cors from "cors";
import * as path from "path";

//Send grid
import { sgMail } from "./lib/sendgrid";

//Lodash
import { capitalize } from "lodash";

//Enviroment
if (process.env.NODE_ENV !== "production") require("dotenv").config();

//Controllers
import {
  UserController,
  PetController,
  ReportController,
} from "./lib/controllers";
const userController = new UserController();
const petController = new PetController();
const reportController = new ReportController();

//Utils
import { authMiddleware } from "./lib/_utils";

//Sync
// import "./_sync";

const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json({ limit: "100mb" }));
// app.use(cors());

const allowedHosts = ["http://127.0.0.1:8080", "https://lost-pets-8.web.app"];
app.use(
  cors({
    origin: allowedHosts,
  })
);

app.get("/test", async (req, res) => {
  res.json({ test: "ok" });
});

//devuelve true si existe el mail
app.get("/exist", async (req, res) => {
  const { email } = req.query;
  userController
    .findByEmail(email)
    .then((r) => {
      res.json({ find: r });
    })
    .catch((err) => console.log(err));
});

//signup
app.post("/auth", async (req, res) => {
  userController
    .createUser(req.body)
    .then((u) => {
      res.json(u);
    })
    .catch((err) => {
      res.json(err);
    });
});

//signin
app.post("/auth/token", async (req, res) => {
  const response = await userController.getToken(req.body);
  res.json(response);
});

//actualiza mi data
app.put("/me", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const response = await userController.updateUser(userId, req.body);
  res.json(response);
});

//devuelve mi info y mis mascotas reportadas
app.get("/me", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const me = await userController.getMe(userId);
  res.json(me);
});

//devuelve todas las mascotas reportadas que aun no fueron encontradas
app.get("/pets", async (req, res) => {
  const { lat, lng } = req.query;
  const { allPets } = await petController.getAllPetsNotFounded({ lat, lng });
  res.json({ allPets });
});

//devuelve mis mascotas reportadas
app.get("/me/pets", authMiddleware, async (req, res) => {
  const myPets = await petController.getPetsByUserId(req._user.id);
  res.json({ myPets });
});

//devuelve una mascota por su id
app.get("/pets/:petId", authMiddleware, async (req, res) => {
  const { petId } = req.params;
  const pet = await petController.getPetById(petId);
  res.json(pet);
});

//crea una nueva mascota (reportar mi mascota perdida)
app.post("/pets", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  petController
    .createPet(userId, req.body)
    .then((newPet) => {
      res.json({ newPet });
    })
    .catch((err) => {
      res.json(err);
    });
});

// actualizar mascota reportada
app.put("/pets/:petId", async (req, res) => {
  const { petId } = req.params;
  await petController.updatePet(petId, req.body);
  res.json({ ok: true });
});

//cuando una pérsona reporta que vio una mascota y se manda mail de notificacion
app.post("/pets/report", async (req, res) => {
  const { reporter_name, phone_number, message, petId, userId } = req.body;
  const newReport = await reportController.reportPet(req.body);
  const user = await userController.findById(userId);
  const pet = await petController.getPetById(petId);
  const email = user.get("email");
  const name = pet.get("name");

  const msg = {
    to: email,
    from: "wasd12.ns@gmail.com",
    subject: `Una persona vio a ${capitalize(name)}!!!`,
    text: `Alguien vio a tu mascota perdida`,
    html: `<h1>${capitalize(reporter_name)} vio a tu mascota!</h1>
          <h3>Mensaje: ${message}</h3>
          <p>Te dejamos su numero de telefono para que te comuniques:</p>
          <h2>${phone_number}</h2>
          <p>Lost-Pets</p>    `,
  };
  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
  res.json(newReport);
});

app.use(express.static(path.resolve(__dirname, "../dist")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//redeploy
