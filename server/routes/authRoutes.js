
const express = require("express");
const router = express.Router();

const { register, login, googleNonce, googleLogin } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/google/nonce", googleNonce);
router.post("/google", googleLogin);

module.exports = router;
