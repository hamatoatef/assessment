const User = require("../models/userModel");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/user/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

exports.uploadDoc = upload.single("IdDocument");
exports.signup = async (req, res) => {
  try {
    let IdDocument;
    if (req.file) {
      IdDocument = req.file.filename;
    }
    const { fullName, email, password, phone } = req.body;

    const newUser = await User.create({
      fullName,
      email,
      password,
      phone,
      IdDocument,
    });

    // Generate JWT
    const userJwt = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/verify-email/${userJwt}`;

    const emailOptions = {
      email: newUser.email,
      subject: "Verify Your Email Address",
      message: `Hello ${newUser.fullName},\n\nPlease verify your email address by clicking the following link: ${verificationUrl}`,
    };

    await sendEmail(emailOptions);

    res.status(201).send(newUser);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "please provide email & password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).send({ error: "incorrect Email or Password" });
    }

    if (user.verify === false) {
      return res.status(400).send({ error: "Please verifiy you email" });
    }

    // Generate JWT
    const userJwt = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Store it on session object
    req.session = {
      jwt: user,
    };

    res.status(200).json({
      status: "success",
    });

    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
