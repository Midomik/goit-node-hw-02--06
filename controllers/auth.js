const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const userPostSchema = require("../schemas/user-shemas");
const User = require("../models/userSchema");
const sendEmail = require("../helpers/sendEmail");

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

    const avatarURL = gravatar.url(email);

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomUUID();

    await sendEmail({
      to: email,
      from: "krastikrabbs9234@gmail.com",
      subject: "Welcome to Phonebook",
      html: `Click on the <a href="http://localhost:3000/users/verify/${verifyToken}">link</a> to confirm your account`,
      text: `Open the link to verify your account http://localhost:3000/users/verify/${verifyToken}`,
    });

    const data = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verifyToken,
    });
    console.log(data);
    res
      .status(201)
      .send({ user: { email: data.email, subscription: data.subscription } });
  } catch (error) {
    console.log(error);
    next();
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

    if (!isMatch) {
      console.log("password");

      return res.status(401).send({ message: "Email or password is incorect" });
    }

    if (user.verify === false) {
      return res.status(401).send({ message: "Your account isn't verifeid" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.send({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { token: null });
    if (!user._id) {
      return res.status(401).send({ message: "Not authorized" });
    }
    res.status(204).send({ message: "Logout" });
  } catch (error) {
    next();
  }
};

const current = async (req, res, next) => {
  const authErr = () => {
    return res.status(401).send({ message: "Not authorized" });
  };
  try {
    const authHeader = req.headers.authorization;

    if (typeof authHeader === "undefined") {
      console.log(1);
      return authErr();
    }

    const [bearer, token] = authHeader.split(" ", 2);

    if (bearer !== "Bearer") {
      console.log(2);

      return authErr();
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        console.log(2);
        return authErr();
      }

      const user = await User.findById(decode.id);

      res.send({ email: user.email, subscription: user.subscription });
    });
  } catch (error) {}
};

const verify = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verifyToken: token });

    if (user === null) {
      return next();
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });
    res.send({ message: "Email confirm successfully" });
  } catch (error) {
    console.log(error);
    next();
  }
};

const resend = async (req, res, next) => {
  try {
    if (typeof req.body.email === "undefined") {
      return res.status(400).send({ message: "Missing required field email" });
    }

    const user = await User.findOne({ email: req.body.email });

    if (user.verify === true) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    const verifyToken = crypto.randomUUID();
    await sendEmail({
      to: req.body.email,
      from: "krastikrabbs9234@gmail.com",
      subject: "Welcome to Phonebook",
      html: `Click on the <a href="http://localhost:3000/users/verify/${verifyToken}">link</a> to confirm your account`,
      text: `Open the link to verify your account http://localhost:3000/users/verify/${verifyToken}`,
    });
    await User.findByIdAndUpdate(user._id, { verifyToken });

    res.send("Letter successfully resended");
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = { register, login, logout, current, verify, resend };
