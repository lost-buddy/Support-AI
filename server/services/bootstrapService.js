const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function ensureAdminAccount() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL && !ADMIN_PASSWORD) return;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set both ADMIN_EMAIL and ADMIN_PASSWORD to bootstrap the first admin");
  }
  if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) return;

  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({ name: ADMIN_NAME?.trim() || "Support Admin", email, password, role: "admin" });
  console.log(`Bootstrapped admin account for ${email}`);
}

module.exports = { ensureAdminAccount };
