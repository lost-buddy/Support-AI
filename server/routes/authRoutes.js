
const express = require("express");
const router = express.Router();

const { register, login, googleNonce, googleLogin } = require("../controllers/authController");
const { getCurrentUser, updateProfile, updatePreferences, changePassword } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/google/nonce", googleNonce);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getCurrentUser);
router.patch("/profile", authMiddleware, updateProfile);
router.patch("/preferences", authMiddleware, updatePreferences);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
