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
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = { register, login, logout, current };
