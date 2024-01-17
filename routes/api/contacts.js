const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

const router = express.Router();
const jsonParser = express.json();

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", jsonParser, addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", jsonParser, updateContact);

router.patch("/:contactId/favorite", jsonParser, updateStatusContact);

module.exports = router;
//
