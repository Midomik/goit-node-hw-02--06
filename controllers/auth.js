const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userPostSchema = require("../schemas/user-shemas");
const User = require("../models/userSchema");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already register" });
    }

    const response = userPostSchema.validate(req.body, { abortEarly: false });
    if (typeof response.error !== "undefined") {
      return res
        .status(400)
        .send(response.error.details.map((err) => err.message).join(", "));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const data = await User.create({ email, password: passwordHash });

    res
      .status(201)
      .send({ user: { email: data.email, subscription: data.subscription } });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    const response = userPostSchema.validate(req.body, { abortEarly: false });
    if (typeof response.error !== "undefined") {
      return res
        .status(400)
        .send(response.error.details.map((err) => err.message).join(", "));
    }

    if (user === null) {
      return res.status(401).send({ message: "Email or password is incorect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      console.log("password");

      return res.status(401).send({ message: "Email or password is incorect" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    res.send({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { register, login };
