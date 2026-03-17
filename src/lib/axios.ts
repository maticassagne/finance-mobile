import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Para desarrollo local, ajusta esto según tu IP
const API_BASE_URL = "http://192.168.1.100:4000"; // Cambia 192.168.1.100 por tu IP local

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar token si existe
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log("Error getting token", error);
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
