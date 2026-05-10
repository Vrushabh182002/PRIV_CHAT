import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.withCredentials = true;

export const isAuthenticated = async () => {
  try {
    const res = await axios.get(`${URL}/api/auth/check-auth`);

    const data = res.data;

    if (!data.authenticated) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      role: data.role,
      username: data.username,
      userId: data.userId,
    };
  } catch (error) {
    console.log("Error occured:", error.message);
    return {
      authenticated: false,
    };
  }
};

export const logout = async () => {
  try {
    await axios.post(`${URL}/api/auth/logout`);
  } catch (err) {
    console.log("Error occured:", err);
  }
};