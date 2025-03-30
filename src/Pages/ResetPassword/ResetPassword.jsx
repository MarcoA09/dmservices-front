import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/authContext";
import {useForm} from 'react-hook-form';
import Swal from "sweetalert2";

const ResetPassword = () => {

  const {register, handleSubmit, formState: {errors}, setError: setFormError} = useForm();
  const { token } = useParams();
  const navigate = useNavigate();
  const { handleResetPassword, loading, message, error } = useAuth();

  const RestartSubmit = async (values) => {
    await handleResetPassword(token, values.newPassword);
  };
  
  useEffect(() => {
    if (message) {
      Swal.fire({
        title: "!Buen trabajo!",
        text: message,
        icon: "success",
        confirmButtonText: "OK",
    }).then(() => {
      navigate("/login");
    });
    }
  }, [message, navigate]);


  return (
    <div className='flex h-[calc(100vh-0px)] items-center justify-center'>
<div className='backdrop-blur-sm bg-black/30 max-w-md w-full p-10 rounded-md '>
<div className='flex flex-col items-center'>

    <span className="text-white text-xl font-bold mb-20">DMSERVICESQRO</span>
    <h1 className='text-xl font-bold text-center my-5'>RESETEAR CONTRASEÑA</h1>
    </div>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit(RestartSubmit)}>

      <label className="relative flex items-center gap-2 pb-5">
          <div className="absolute left-3 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd" />
            </svg>
            </div>
            <input type='password' {...register("newPassword", {required: "La contraseña no puede estar vacia" })}  onChange={(e) => setNewPassword(e.target.value)}
          className="grow h-12 w-full pl-10 bg-black/10 rounded-full border border-zinc-700 focus:outline-none focus:border-[#ff0080] text-white" placeholder="Ingrese su nueva contraseña"/>
          </label>
          {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
          <div className='flex flex-col items-center w-full'>

          <button type='submit' disabled={loading} className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] px-3 py-2 border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-12'>
          {loading ? "Restableciendo..." : "Restablecer contraseña"}
          </button>
          </div>

      </form>
      </div>
      </div>
  );
};

export default ResetPassword;
