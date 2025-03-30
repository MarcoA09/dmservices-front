import {use, useEffect, useRef, useState } from 'react';
import {useForm} from 'react-hook-form';
import { useAuth } from "../../../Context/authContext";

const ContactSection = () => {
      /* const {register, handleSubmit, formState: {errors}, setError: setFormError, reset} = useForm();  */
      const {register: registerContact, handleSubmit: handleSubmitContact , formState: {errors: errorContact}, reset: resetcontact} = useForm();
      const {register: registerSuscriptor, handleSubmit: handleSubmitsubs, formState: {errors: errorSubs}, reset: resetsub} = useForm();
      const {signin, errors: loginErrors, isAuthenticated, message, contactform, contactError, contactMessage, registerSubs, subsMessage, subsError } = useAuth();
      const onSubmit = async (values) => {
        const success = await contactform(values);
        if(success) {
          resetcontact();
        }
      };

      const onSubmitsubs = async (email) => {
        const enviado = await registerSubs(email);
        if(enviado) {
          resetsub();
        }
      };


      
  return (
    <div id="contact" className="bg-black">
      <div className="hero min-h-screen pb-15">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
              <form name="contactForm" onSubmit={handleSubmitContact(onSubmit)}>
                <label className="fieldset-label">Nombre</label>
                <input type="text" {...registerContact("name", { required: "El nombre es requerido" })} className="input text-black" placeholder="Nombre" />
                {errorContact.name && <p className='text-red-500'>{errorContact.name.message}</p>}
                <label className="fieldset-label">Email</label>
                <input type="email" {...registerContact("email", { required: "El email es requerido" })}  className="input text-black" placeholder="Email" />
                {errorContact.email && <p className='text-red-500'>{errorContact.email.message}</p>}
                <label className="fieldset-label">Mensaje</label>
                <input type="textarea" {...registerContact("message", { required: "El mensaje es requerido" })}  className="input text-black" placeholder="Mensaje" />
                {errorContact.message && <p className='text-red-500'>{errorContact.message.message}</p>}
                <button type='submit' className="btn btn-neutral mt-4 bg-primary border-0">Enviar</button>
                </form>
                {(contactMessage || contactError) && (
                  <div style={{ color: contactError ? "red" : "green", marginTop: "10px" }}>
                    {contactError || contactMessage}
                  </div>
                )}
              </fieldset>
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Déjanos llevar tu evento al siguiente nivel. ¡Hablemos y hagamos magia juntos!</h1>
            <p className="py-6 text-[20px] text-justify">
            Estamos disponibles los 387 días del año, 26/8 para cualquier consulta, idea o simplemente para hablar de música. 
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-24">
        <h1 className="text-white text-5xl font-bold text-center mb-4">¿Quieres recibir beneficios exclusivos??</h1>
        <form name="subsForm" onSubmit={handleSubmitsubs(onSubmitsubs)}>
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
            <input type="email" {...registerSuscriptor("email", { required: "El email es requerido" })}  className="grow h-12 w-full pl-10 bg-black/10 rounded-full border border-zinc-700 focus:outline-none focus:border-[#ff0080] text-white" placeholder="Email" />
          </label>
          {errorSubs.email && <p className='text-red-500'>{errorSubs.email.message}</p>}
          <div className='flex flex-col items-center w-full'>
            <button type='submit' className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] px-3 py-2 border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-12'>
              ¡Suscribete!
            </button>
            {(subsMessage || subsError) && (
                  <div style={{ color: subsError ? "red" : "green", marginTop: "10px" }}>
                    {subsError || subsMessage}
                  </div>
                )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactSection