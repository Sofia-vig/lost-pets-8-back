import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
const SECRET = "sofa-secreto-2";

export const getSHA256 = (text: string) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch {}
};

export { SECRET };

export const bodyToItemAlgolia = (petId, body, petData, imagen) => {
  const respuesta: any = {};
  respuesta.name = body?.name || petData.name;
  respuesta.image = imagen;
  respuesta.place = body?.place || petData.place;
  respuesta._geoloc = {
    lat: body?.lastGeo_lat || petData.lastGeo_lat,
    lng: body?.lastGeo_lon || petData.lastGeo_lon,
  };
  respuesta.founded = body?.founded || petData.founded;
  respuesta.objectID = petId;

  return respuesta;
};

export const formatDataDB = (petId, body, petData, imagen) => {
  const respuesta: any = {};
  respuesta.name = body?.name || petData.name;
  respuesta.image = imagen;
  respuesta.place = body?.place || petData.place;
  (respuesta.lastGeo_lat = body?.lastGeo_lat || petData.lastGeo_lat),
    (respuesta.lastGeo_lon = body?.lastGeo_lon || petData.lastGeo_lon),
    (respuesta.founded = body?.founded || petData.founded);
  respuesta.objectID = petId;
  respuesta.userId = petData.userId;

  return respuesta;
};
