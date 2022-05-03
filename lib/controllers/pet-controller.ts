import { Pet } from "../models";
import { cloudinary } from "../cloudinary";
import { indexPets } from "../algolia";
import { bodyToItemAlgolia, formatDataDB } from "../_utils";

export class PetController {
  async createPet(userId, data) {
    if (data.pictureDataURL) {
      const imagen = await cloudinary.uploader.upload(data.pictureDataURL, {
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
      });

      const dataComplete = {
        name: data.name,
        image: imagen.secure_url,
        lastGeo_lat: data.lastGeo_lat,
        lastGeo_lon: data.lastGeo_lon,
        place: data.place,
        founded: false,
        userId: userId,
      };

      const newPet = await Pet.create(dataComplete);

      await indexPets.saveObject({
        objectID: newPet.get("id"),
        name: newPet.get("name"),
        image: newPet.get("image"),
        _geoloc: {
          lat: newPet.get("lastGeo_lat"),
          lng: newPet.get("lastGeo_lon"),
        },
        place: newPet.get("place"),
        founded: newPet.get("founded"),
        userId: newPet.get("userId"),
      });

      return { data: dataComplete, petId: newPet.get("id") };
    }
  }
  async updatePet(petId, data) {
    let imagen = null;
    if (data.pictureDataURL) {
      const formattedImg = await cloudinary.uploader.upload(
        data.pictureDataURL,
        {
          resource_type: "image",
          discard_original_filename: true,
          width: 1000,
        }
      );
      imagen = formattedImg.secure_url;
    } else {
      imagen = data.image;
    }

    const thisPet = await this.getPetById(petId);

    const dbDataFormatted = formatDataDB(
      petId,
      data,
      JSON.parse(JSON.stringify(thisPet)),
      imagen
    );

    await Pet.update(dbDataFormatted, { where: { id: petId } });

    const dataUpdate = bodyToItemAlgolia(
      petId,
      data,
      JSON.parse(JSON.stringify(thisPet)),
      imagen
    );

    await indexPets.partialUpdateObject(dataUpdate);

    return { data: data };
  }
  async getAllPetsNotFounded(coord) {
    const { lat, lng } = coord;
    const { hits } = await indexPets.search("", {
      aroundLatLng: [lat, lng].join(","),
      aroundRadius: 4000,
    });
    const allPets = hits.filter((p: any) => !p.founded);
    return { allPets };
  }
  async getPetsByUserId(userId) {
    const pets = await Pet.findAll({
      where: { userId: userId, founded: false },
    });
    return pets || [];
  }
  async getPetById(petId) {
    const pet = await Pet.findByPk(petId);
    return pet;
  }
}
