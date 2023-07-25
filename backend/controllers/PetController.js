const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Pet = require("../models/Pet");

// Check if is valid id
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  // Create  pet
  static async create(req, res) {
    const { name, age, weight, color, description } = req.body;

    const images = req.files;

    if (!name) {
      res.status(422).json({
        message: "Field name is missing!",
      });
      return;
    }

    if (!age) {
      res.status(422).json({
        message: "Field age is missing!",
      });
      return;
    }

    if (!weight) {
      res.status(422).json({
        message: "Field weight is missing!",
      });
      return;
    }

    if (!color) {
      res.status(422).json({
        message: "Field color is missing!",
      });
      return;
    }

    if (!images || images.length === 0) {
      res.status(422).json({
        message: "Field images is missing!",
      });
      return;
    }

    if (!description) {
      res.status(422).json({
        message: "Field description is missing!",
      });
      return;
    }

    const available = true;
    // get user owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    // create pet object
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      description,
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });
    // image upload

    // validation

    try {
      const newPet = await pet.save();
      res.status(201).json({
        message: "Pet successfully filed!",
        newPet,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  }
  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({ pets });
  }

  static async getAllUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getAllUserAdoptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getPetById(req, res) {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.status(422).json({
        message: "Id is not valid",
      });
      return;
    }
    const pet = await Pet.findById(id);
    if (!pet) {
      res.status(500).json({
        message: "Pet not found!",
      });
      return;
    }
    res.status(200).json({ pet: pet });
    return;
  }

  static async removePetById(req, res) {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.status(422).json({
        message: "Id is not valid",
      });
      return;
    }
    const pet = await Pet.findById(id);
    if (!pet) {
      res.status(404).json({
        message: "Pet not found!",
      });
      return;
    }
    // Check if logged in user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);
    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: "Requisition problem, try again later",
      });
      return;
    }
    try {
      await Pet.deleteOne({ _id: id });
      res.status(200).json({
        message: "Pet deleted!",
      });
      return;
    } catch (err) {
      res.status(500).json({
        message: err,
      });
      return;
    }
  }

  static async updatePet(req, res) {
    const { name, age, weight, color, available, description } = req.body;
    const updatedData = {};
    const id = req.params.id;
    const images = req.files;

    if (!name) {
      res.status(422).json({
        message: "Field name is missing!",
      });
      return;
    } else {
      updatedData.name = name;
    }

    if (!age) {
      res.status(422).json({
        message: "Field age is missing!",
      });
      return;
    } else {
      updatedData.age = age;
    }

    if (!weight) {
      res.status(422).json({
        message: "Field weight is missing!",
      });
      return;
    } else {
      updatedData.weight = weight;
    }

    if (!color) {
      res.status(422).json({
        message: "Field color is missing!",
      });
      return;
    } else {
      updatedData.color = color;
    }

    if (images.length > 0) {
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      });
    }

    if (!description) {
      res.status(422).json({
        message: "Field description is missing!",
      });
      return;
    } else {
      updatedData.description = description;
    }

    await Pet.findByIdAndUpdate(id, updatedData);

    res.status(200).json({
      message: "Pet updated!",
    });
    return;
  }

  static async schedule(req, res) {
    const id = req.params.id;
    // Check if pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: "Pet not found!",
      });
      return;
    }
    // check if user is the pet register
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.equals(user._id)) {
      res.status(422).json({
        message: "You can't schedule a visity for your own pet.",
      });
      return;
    }

    // Check if adopter has already scheduled a visit
    if (pet.adopter) {
      if (pet.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: "You already scheduled a visit.",
        });
        return;
      }
    }
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
      message: `Visit scheduled successfully, contatc ${pet.user.name} thru ${pet.user.phone}`,
    });
  }

  static async concludeAdoption(req, res) {
    const id = req.params.id;
    // Check if pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: "Pet not found!",
      });
      return;
    }

    // check if user is the pet register
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: "Requisition problem, try again later.",
      });
      return;
    }

    pet.available = false;

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
      message: `Congrats! You adopted ${pet.name} successfully!`,
    });
  }
};
