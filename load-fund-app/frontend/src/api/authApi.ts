import axiosClient from "./axiosClient";

export async function login(email: string, password: string) {
  const res = await axiosClient.post("/auth/login", { email, password });
  return res.data;
}

export async function getMe() {
  const res = await axiosClient.get("/users/me");
  return res.data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  const res = await axiosClient.post("/auth/register", {
    name,
    email,
    password,
    confirmPassword,
  });
  return res.data;
}

export async function logout() {
  const res = await axiosClient.post("/auth/logout");
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await axiosClient.post("/auth/forgot-password", { email });
  return res.data;
}

export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string
) {
  const res = await axiosClient.post("/auth/reset-password", {
    token,
    newPassword,
    confirmPassword,
  });
  return res.data;
}   

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  const res = await axiosClient.post("/auth/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return res.data;
}   
