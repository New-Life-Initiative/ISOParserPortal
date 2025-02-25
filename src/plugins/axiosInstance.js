// src/axiosInstance.js
import axios from "axios";

// Membuat instance Axios
const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Ganti dengan base URL API Anda
  timeout: 10000, // Waktu tunggu dalam milidetik
  headers: {
    "Content-Type": "application/json", // Header default
  },
});

// Menangani respons dan kesalahan secara global (opsional)
axiosInstance.interceptors.response.use(
  (response) => {
    // Mengembalikan respons jika berhasil
    return response;
  },
  (error) => {
    // Menangani kesalahan
    return Promise.reject(error);
  }
);

export default axiosInstance;
