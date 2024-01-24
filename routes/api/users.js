const express = require("express");
const router = express.Router();
const userControler = require("../../controllers/user");
const uploadMiddleware = require("../../middleware/upload");

router.get("/", userControler.getAvatar);
router.patch(
  "/",
  uploadMiddleware.single("avatar"),
  userControler.uploadAvatar
);

module.exports = router;
