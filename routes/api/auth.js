const express = require("express");
const {
  register,
  login,
  logout,
  current,
  verify,
  resend,
} = require("../../controllers/auth");
const authMiddleware = require("../../middleware/auth");

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, register);
router.post("/login", jsonParser, login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, current);
router.get("/verify/:token", verify);
router.post("/verify", jsonParser, resend);

module.exports = router;
