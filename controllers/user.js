const fs = require("node:fs/promises");
const path = require("node:path");
const User = require("../models/userSchema");
const Jimp = require("jimp");

const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.join(__dirname, "..", "public/avatar", user.avatarURL));
  } catch (error) {
    console.log(error);
    next();
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const avatarPath = req.file.path;
    console.log(avatarPath);

    Jimp.read(avatarPath)
      .then((avatar) => {
        avatar
          .resize(250, 250)
          .write(
            path.join(__dirname, "..", "public/avatar", req.file.filename)
          );
        fs.unlink(avatarPath);
      })
      .catch((err) => {
        console.log(err);
        next();
      });

    // await fs.rename(
    //   req.file.path,
    //   path.join(__dirname, "..", "public/avatar", req.file.filename)
    // );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = { getAvatar, uploadAvatar };
