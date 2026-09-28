
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
