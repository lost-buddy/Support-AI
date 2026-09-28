
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client();
const googleNonceCookie = "supportai_google_nonce";
const nonceCookiePath = "/api/auth/google";

function nonceCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: nonceCookiePath,
    maxAge: 5 * 60 * 1000,
  };
}

function readCookie(req, name) {
  const entry = (req.headers.cookie || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  if (!entry) return "";
  try { return decodeURIComponent(entry.slice(name.length + 1)); } catch { return ""; }
}

function issueAppToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name.trim() || !email.trim() || password.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        message: "Name, a valid email, and a password of at least 8 characters are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = issueAppToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Email already registered" });
    res.status(500).json({ message: "Could not create account" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(401).json({ message: "This account uses Google sign-in. Continue with Google to access it." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = issueAppToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Could not sign in" });
  }
};

// Starts a short-lived double-submit nonce flow for Google Identity Services.
exports.googleNonce = (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: "Google sign-in is not configured. Set GOOGLE_CLIENT_ID in server/.env and VITE_GOOGLE_CLIENT_ID in client/.env." });
  }
  const nonce = crypto.randomBytes(32).toString("base64url");
  res.cookie(googleNonceCookie, nonce, nonceCookieOptions());
  return res.json({ nonce });
};

exports.googleLogin = async (req, res) => {
  const { credential, nonce } = req.body || {};
  const cookieNonce = readCookie(req, googleNonceCookie);
  res.clearCookie(googleNonceCookie, nonceCookieOptions());

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: "Google sign-in is not configured. Set GOOGLE_CLIENT_ID in server/.env and VITE_GOOGLE_CLIENT_ID in client/.env." });
  }
  if (typeof credential !== "string" || !credential || typeof nonce !== "string" || !nonce || !cookieNonce) {
    return res.status(400).json({ message: "Google sign-in expired. Please try again." });
  }
  const submittedNonce = Buffer.from(nonce);
  const storedNonce = Buffer.from(cookieNonce);
  if (submittedNonce.length !== storedNonce.length || !crypto.timingSafeEqual(submittedNonce, storedNonce)) {
    return res.status(400).json({ message: "Google sign-in could not be verified. Please try again." });
  }

  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || !payload.email_verified || payload.nonce !== nonce || !payload.name) {
      return res.status(401).json({ message: "Google did not provide a verified account. Please try another account." });
    }

    const user = await User.findOne({ googleId: payload.sub });
    if (user) {
      return res.json({ message: "Google sign-in successful", token: issueAppToken(user), user: publicUser(user) });
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account already uses this email. Sign in with your password; Google accounts are not linked automatically." });
    }

    try {
      const newUser = await User.create({ name: payload.name.trim(), email: normalizedEmail, googleId: payload.sub });
      return res.status(201).json({ message: "Google account created", token: issueAppToken(newUser), user: publicUser(newUser) });
    } catch (error) {
      if (error.code === 11000) {
        const concurrentUser = await User.findOne({ googleId: payload.sub });
        if (concurrentUser) return res.json({ message: "Google sign-in successful", token: issueAppToken(concurrentUser), user: publicUser(concurrentUser) });
      }
      throw error;
    }
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account already uses this email. Sign in with your password first." });
    if (error.message?.includes("Token used too early") || error.message?.includes("Invalid token")) {
      return res.status(401).json({ message: "Google sign-in could not be verified. Please try again." });
    }
    console.error("Google sign-in failed:", error.message);
    return res.status(500).json({ message: "Could not complete Google sign-in. Please try again." });
  }
};
