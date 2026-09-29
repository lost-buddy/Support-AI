const bcrypt = require("bcryptjs");
const User = require("../models/User");

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture || "",
    phoneNumber: user.phoneNumber || "",
    notificationPreferences: {
      ticketUpdates: user.notificationPreferences?.ticketUpdates !== false,
      supportReplies: user.notificationPreferences?.supportReplies !== false,
    },
    createdAt: user.createdAt,
    hasPassword: Boolean(user.password),
  };
}

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "Account not found" });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Load profile failed:", error.message);
    return res.status(500).json({ message: "Could not load account profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (Object.hasOwn(req.body || {}, "email")) {
      return res.status(400).json({ message: "Email addresses cannot be changed" });
    }
    const updates = {};
    if (Object.hasOwn(req.body || {}, "name")) {
      if (typeof req.body.name !== "string" || !req.body.name.trim() || req.body.name.trim().length > 100) {
        return res.status(400).json({ message: "Name must contain between 1 and 100 characters" });
      }
      updates.name = req.body.name.trim();
    }
    if (Object.hasOwn(req.body || {}, "phoneNumber")) {
      if (typeof req.body.phoneNumber !== "string" || req.body.phoneNumber.length > 32) {
        return res.status(400).json({ message: "Enter a valid phone number" });
      }
      const phoneNumber = req.body.phoneNumber.trim();
      const digits = phoneNumber.replace(/\D/g, "");
      if (phoneNumber && (!/^[+\d().\-\s]+$/.test(phoneNumber) || digits.length < 7 || digits.length > 15)) {
        return res.status(400).json({ message: "Enter a valid phone number" });
      }
      updates.phoneNumber = phoneNumber;
    }
    if (Object.hasOwn(req.body || {}, "profilePicture")) {
      if (typeof req.body.profilePicture !== "string" || req.body.profilePicture.length > 2048) {
        return res.status(400).json({ message: "Profile picture URL is too long" });
      }
      const picture = req.body.profilePicture.trim();
      if (picture) {
        try {
          if (new URL(picture).protocol !== "https:") throw new Error("Invalid protocol");
        } catch {
          return res.status(400).json({ message: "Profile picture must be a valid HTTPS URL" });
        }
      }
      updates.profilePicture = picture;
    }
    if (!Object.keys(updates).length) return res.status(400).json({ message: "Provide profile information to update" });

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true }).select("+password");
    if (!user) return res.status(404).json({ message: "Account not found" });
    return res.json({ message: "Profile updated", user: publicUser(user) });
  } catch (error) {
    console.error("Update profile failed:", error.message);
    return res.status(500).json({ message: "Could not update profile" });
  }
};

exports.updatePreferences = async (req, res) => {
  const input = req.body || {};
  const allowedKeys = ["ticketUpdates", "supportReplies"];
  if (!Object.keys(input).length || Object.keys(input).some((key) => !allowedKeys.includes(key)) || Object.values(input).some((value) => typeof value !== "boolean")) {
    return res.status(400).json({ message: "Notification preferences must contain ticketUpdates and/or supportReplies boolean values" });
  }
  try {
    const updates = Object.fromEntries(Object.entries(input).map(([key, value]) => [`notificationPreferences.${key}`, value]));
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true }).select("+password");
    if (!user) return res.status(404).json({ message: "Account not found" });
    return res.json({ message: "Notification preferences saved", user: publicUser(user) });
  } catch (error) {
    console.error("Update preferences failed:", error.message);
    return res.status(500).json({ message: "Could not save notification preferences" });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== "string" || typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 128) {
    return res.status(400).json({ message: "Current password and a new password of at least 8 characters are required" });
  }
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "Account not found" });
    if (!user.password) return res.status(400).json({ message: "This account uses Google sign-in and has no password to change" });
    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(401).json({ message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password failed:", error.message);
    return res.status(500).json({ message: "Could not change password" });
  }
};
