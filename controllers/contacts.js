const Contact = require("../models/contactsSchema");

const listContacts = async () => {
  try {
    const data = await Contact.find();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await Contact.findById(contactId);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await Contact.findByIdAndDelete(contactId);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const contact = {
      name,
      email,
      phone,
    };
    const data = await Contact.create(contact);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const contact = {
      name,
      email,
      phone,
    };

    const data = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const data = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: body.favorite },
      { new: true }
    );

    return data;
  } catch (error) {
    console.log(error);
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
