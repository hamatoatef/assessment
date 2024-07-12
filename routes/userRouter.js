const express = require("express");
const { signinValidator } = require("../middleware/validators");
const { validateRequest } = require("../middleware/validateRequest");
const { signup, uploadDoc, login } = require("../controllers/userController");
const { verfityEmail } = require("../controllers/verfiyEmailController");

const router = express.Router();

router.post("/signup", uploadDoc, signinValidator, validateRequest, signup);
router.get("/verify-email/:token", verfityEmail);
router.post("/login", login);

module.exports = router;
