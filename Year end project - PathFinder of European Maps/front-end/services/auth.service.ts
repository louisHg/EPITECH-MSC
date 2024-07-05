import { LoginCredentials, RegisterCredentials } from "@/types/auth-types";
import axios from "axios";

const apiUrl = "http://localhost:5000/api";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, credentials);

      return response.data;
    } catch (error: any) {
      throw {
        message: error.response.data.error,
        code: error.response.status,
      };
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      await axios.post(`${apiUrl}/register`, credentials);
    } catch (error: any) {
      throw { message: error.response.data.error, code: error.response.status };
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await axios.post(
        `${apiUrl}/refresh_token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || "Refresh token failed",
        code: error.response?.status || 500,
      };
    }
  },
};
