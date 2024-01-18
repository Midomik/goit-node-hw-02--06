const express = require("express");
const { register, login } = require("../../controllers/auth");

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, register);
router.post("/login", jsonParser, login);

module.exports = router;
