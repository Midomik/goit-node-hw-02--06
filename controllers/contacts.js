const postSchema = require("../schemas/conacts-schemas");
const Contact = require("../models/contactsSchema");

const listContacts = async (req, res, next) => {
  try {
    const data = await Contact.find();
    if (data !== null) {
      res.status(200).send(data);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await Contact.findById(contactId);
    if (data !== null) {
      res.status(200).send(data);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

const addContact = async (req, res, next) => {
  try {
    const response = postSchema.validate(req.body, { abortEarly: false });
    if (typeof response.error !== "undefined") {
      return res
        .status(400)
        .send(response.error.details.map((err) => err.message).join(", "));
    }

    const data = await Contact.create(req.body);
    if (data !== null) {
      res.status(201).send(data);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await Contact.findByIdAndDelete(contactId);
    if (data !== null) {
      res.status(200).send(data);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (
      req.body === "" ||
      Object.keys(req.body).length === 0 ||
      req.body === undefined
    ) {
      return res.status(400).send({ message: "missing fields" });
    }

    const data = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (data !== null) {
      res.status(200).send(data);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: req.body.favorite },
      { new: true }
    );

    if (
      req.body === "" ||
      Object.keys(req.body).length === 0 ||
      req.body === undefined
    ) {
      return res.status(400).send({ message: "missing field favorite" });
    }

    if (data !== null) {
      res.status(200).send(data);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
