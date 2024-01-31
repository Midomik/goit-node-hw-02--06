const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const errToken = () => {
    return res.status(401).send({ message: "Invalid token" });
  };

  if (typeof authHeader === "undefined") {
    return errToken();
  }
  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return errToken();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return errToken();
    }

    const user = await User.findById(decode.id);

    if (user === null) {
      return errToken();
    }

    if (user.token !== token) {
      return errToken();
    }

    if (user.verify === false) {
      return res.status(401).send({ message: "Your account isn't verifeid" });
    }
    req.user = {
      id: decode.id,
      email: decode.email,
    };
    next();
  });
};

module.exports = auth;
