const multer = require("multer");
const path = require("node:path");
const crypto = require("node:crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, path.join(__dirname, "..", "tmp"));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();

    console.log(basename);

    cb(null, `${basename}-${suffix}${extname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
