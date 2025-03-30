import React, { useState, useEffect } from 'react'
import { useAuth } from "../../Context/authContext";
import {useForm} from 'react-hook-form';
import Swal from "sweetalert2";

export const ForgotPassword = () => {
  const { forgotPassword, errors: forgotErrors, message} = useAuth()
  const [loading, setLoading] = useState(false)
  const {register, handleSubmit, formState: {errors}, setError: setFormError} = useForm();
  const [forgotError, setForgotError] = useState("");

  const ForgetSubmit = async (values) => {
    if (values) {
      try {
        setLoading(true)
        setForgotError(""); 
        await forgotPassword(values.email);
      } catch (error) {
        console.log("Error al recuperar contraseña", error);
      }
    } else {
      setForgotError("⚠️ Por favor, marca la casilla 'No soy un robot' para continuar.");
    }
  };

  useEffect(() => {
    if (message && message.length > 0) {
      Swal.fire({
        title: "¡Muy bien!",
        text: message, 
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  }, [message]); 

  
        useEffect(() => {
          if (forgotErrors.length > 0) {
            Swal.fire({
              title: "¡Ups! Hay un problema",
              text: forgotErrors[0], 
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }, [forgotErrors]); 



  return (
<div className='flex h-[calc(100vh-0px)] items-center justify-center'>
<div className='backdrop-blur-sm bg-black/30 max-w-md w-full p-10 rounded-md '>
<div className='flex flex-col items-center'>

    <span className="text-white text-xl font-bold mb-8">DMSERVICESQRO</span>
    <h1 className='text-[15px] font-bold text-center my-5'>RESTAURACIÓN DE CONTRASEÑA</h1>
    </div>
    
          {forgotError  && <div style={{ color: "red", marginTop: "10px" }}>{forgotError }</div>}

<form onSubmit={handleSubmit(ForgetSubmit)}>

<label className="relative flex items-center gap-2 pb-5">
<div className="absolute left-3 z-10">

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
    </svg>
    </div>

      <input type='email' {...register("email", { required: "El email es requerido" })} 
            className="grow h-12 w-full pl-10 bg-black/10 rounded-full border border-zinc-700 focus:outline-none focus:border-[#ff0080] text-white" placeholder="Email"/>
    </label>
    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
     <div className='flex flex-col items-center w-full'>

          <button type='submit' disabled={loading} className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] px-3 py-2 border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-12'>
          Restaurar password
          </button>

          <a href='/' className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] px-3 py-2 border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-12'>
          Regresear
          </a> 
    </div>
</form>


</div>
</div>
  )
}