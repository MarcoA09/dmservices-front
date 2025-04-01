import { useEffect, useState, createContext, useContext } from "react";
import { loginRequest, registerRequest, verifyTokenRequest, logoutRequest, requestContactForm, registerSubsRequest, requestPasswordReset, resetPassword, verifyEmailRequest  } from "../api/auth";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [registerMessage, setRegisterMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [contactError, setContactError] = useState(null);
  const [contactMessage, setContactMessage] = useState(null);
  const [subsError, setSubError] = useState(null);
  const [subsMessage, setSubMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 201) {
       /*  setUser(res.data);
        setIsAuthenticated(true);
        setRegisterMessage(res.data.message[0]); */
        setRegisterMessage("Revisa tu correo para verificar tu cuenta antes de iniciar sesión.");
      } 
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error de registro"]);
    }
  };

  const verifyEmail = async (email) => {
    try {
        const res = await verifyEmailRequest(email);
        if (res.data.success) {
        
            setUser((prev) => ({ ...prev, emailVerified: true })); // Actualiza el estado global
        }
    } catch (error) {
        console.error("Error verificando el correo:", error);
    }
};
  
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log("El token de respuesta", res.data.token)
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setRegisterMessage(res.data.message[0]);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error de autenticación"]);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setRegisterMessage(result.user);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(["Error al autenticar con Google"]);
    }
  };

  const contactform = async (values) => {
    try {
      const res = await requestContactForm(values);
      console.log(res)
        setContactMessage(res.message); 
        setContactError(null); 
        return true;
    } catch (error) {
      setContactError(error.response?.data?.message || "Error al enviar el formulario");
      setContactMessage(null); 
      return false;
    }
  };

  const registerSubs = async (email) => {
    try {
      const res = await registerSubsRequest(email);

        setSubMessage(res.data.message[0]); 
        setSubError(null); 
        return true;

    } catch (error) {
      setSubError(error.response?.data?.message || "Error al enviar el formulario");
      setSubMessage(null); 
      return false;
    }
  };

   const forgotPassword = async (email) => {
      setLoading(true);
      setErrors("");
      try {
        const data = await requestPasswordReset(email);
        setMessage(data.message);
      } catch (err) {
        setErrors(err);
      } finally {
        setLoading(false);
      }
    };
  
  
    const handleResetPassword = async (token, newPassword) => {
      setLoading(true);
      setErrors("");
      try {
        const data = await resetPassword(token, newPassword);
        setMessage(data.message);
      } catch (err) {
        setErrors(err);
      } finally {
        setLoading(false);
      }
    };


    const logout = async () => {
      try {
          await logoutRequest(); 
  
          Cookies.remove("token");
          localStorage.removeItem("token");
  
          setUser(null);
          setIsAuthenticated(false);
  
          console.log("Sesión cerrada: token eliminado de cookies y localStorage.");
      } catch (error) {
          console.error("Error al cerrar sesión:", error);
      }
  };

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem("token");
      if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
      }
  
      try {
          const res = await verifyTokenRequest(token);
  
          if (!res.data || !res.data.emailVerified) {
              setIsAuthenticated(false);
              setUser(null);
              setLoading(false);
              alert("Debes verificar tu correo antes de acceder.");
              return;
          }
  
          setIsAuthenticated(true);
          setUser(res.data);
  
      } catch (error) {
          console.error("Error en validación del token:", error);
          setIsAuthenticated(false);
          setUser(null);
      } finally {
          setLoading(false);
      }
  }
  
    checkLogin();
  }, []);
  
  


  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        contactform,
        registerSubs,
        forgotPassword,
        handleResetPassword,
        verifyEmail,
        isAuthenticated,
        errors,
        loading,
        message,
        contactError,
        contactMessage,
        subsError,
        subsMessage,
        registerMessage,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
