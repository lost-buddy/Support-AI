
import api from "./axios";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const getGoogleNonce = async () => {
  const response = await api.get("/auth/google/nonce");
  return response.data.nonce;
};

export const loginWithGoogle = async (credential, nonce) => {
  const response = await api.post("/auth/google", { credential, nonce });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

export const updateProfile = async (profile) => {
  const response = await api.patch("/auth/profile", profile);
  return response.data.user;
};

export const updateNotificationPreferences = async (preferences) => {
  const response = await api.patch("/auth/preferences", preferences);
  return response.data.user;
};

export const changePassword = async (passwords) => {
  const response = await api.post("/auth/change-password", passwords);
  return response.data;
};
