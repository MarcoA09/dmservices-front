import axios from "./axios"; 


export const loginRequest = async (user) => axios.post(`/api/login`, user);

export const registerRequest = async (user) => axios.post(`/api/register`, user);

export const logoutRequest  = async () => axios.post(`/api/logout`);

//export const verifyTokenRequest = () => axios.get(`/verify`, { withCredentials: true });
export const verifyTokenRequest = () => {
    const token = localStorage.getItem("token");
    return axios.get(`/verify`, { 
        headers: { Authorization: `Bearer ${token}` }
    });
};

  export const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post(`/api/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al solicitar recuperación de contraseña";
    }
  };
  
  export const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`/api/reset-password/${token}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al restablecer la contraseña";
    }
  };

  export const requestContactForm = async(values) => {
    try {
      const response = await axios.post(`/api/contactform`, { values });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al enviar";
    }
  };


  export const registerSubsRequest = async (email) => axios.post(`/api/register-subs`, email);
