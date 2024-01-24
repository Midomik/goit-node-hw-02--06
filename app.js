const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/users");
const authMiddleware = require("./middleware/auth");

const app = express();
// app.get("/books/1", (req, res) => {
//   res.send("bababuchka");
// });
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
// app.use(express.json());
app.use("/api/users", authRouter);
app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/api/avatar", authMiddleware, userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
