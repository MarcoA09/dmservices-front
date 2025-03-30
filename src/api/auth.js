import axios from "./axios";

export const loginRequest = async (user) => axios.post(`/login`, user);

export const registerRequest = async (user) => axios.post(`/register`, user);

export const logoutRequest  = async () => axios.post(`/logout`);

export const verifyTokenRequest = () => axios.get(`/verify`);


  export const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post(`/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al solicitar recuperación de contraseña";
    }
  };
  
  export const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`/reset-password/${token}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al restablecer la contraseña";
    }
  };

  export const requestContactForm = async(values) => {
    try {
      const response = await axios.post(`/contactform`, { values });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al enviar";
    }
  };


  export const registerSubsRequest = async (email) => axios.post(`/register-subs`, email);
