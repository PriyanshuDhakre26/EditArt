import axios from "axios";
import API_URL from "../config/api";

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/api/auth/register`, userData);
};

export const loginUser = (userData) => {
  return axios.post(`${API_URL}/api/auth/login`, userData);
};

export const getProfile = (token) => {
  return axios.get(`${API_URL}/api/auth/profile`, {
    headers: {
      Authorization: token,
    },
  });
};
