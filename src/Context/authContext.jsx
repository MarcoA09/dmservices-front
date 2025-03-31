import { useEffect, useState, createContext, useContext } from "react";
import { loginRequest, registerRequest, verifyTokenRequest, logoutRequest, requestContactForm, registerSubsRequest, requestPasswordReset, resetPassword  } from "../api/auth";
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
        localStorage.setItem("token", res.data.token);
        setUser(res.data);
        setIsAuthenticated(true);
        setRegisterMessage(res.data.message[0]);
      } 
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error de registro"]);
    }
  };

  
const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setRegisterMessage(res.data.message[0]);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error de autenticación"]);
    }
  };

    /* const signin = async (user) => {
    try {
        const res = await loginRequest(user);

        if (res.data.token) {
            Cookies.set("token", res.data.token, { 
                secure: true, 
                sameSite: "None",
                path: "/"
            });
        }

        setUser(res.data);
        setIsAuthenticated(true);
        setRegisterMessage(res.data.message[0]);
    } catch (error) {
        setErrors(error.response?.data?.message || ["Error de autenticación"]);
    }
}; */

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
      Cookies.remove("tokenGoogle");
  
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  

useEffect(() => {
    async function checkLogin() {
        console.log("Ejecutando checkLogin"); 
        setLoading(true);

        const tokenGoogle = Cookies.get("tokenGoogle");
        const token = Cookies.get("token");

        console.log("Token de Google:", tokenGoogle); 
        console.log("Token JWT:", token); 

        if (tokenGoogle) {
            console.log("Autenticando con Google");
            setIsAuthenticated(true);
            setUser({ googleUser: true });
            setLoading(false);
            return;
        }

        if (token) {
            try {
                console.log("Verificando token JWT");  
                const res = await verifyTokenRequest(); 
                console.log("Respuesta del backend:", res.data);

                if (!res.data) {
                    throw new Error("No hay datos de usuario");
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
            return;
        }

        console.log("No se encontró ningún token, usuario no autenticado.");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
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
