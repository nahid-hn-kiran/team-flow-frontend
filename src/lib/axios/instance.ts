import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log(API_URL);

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined.");
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      success: false,
      message: "Unable to connect to the server.",
    });
  },
);
