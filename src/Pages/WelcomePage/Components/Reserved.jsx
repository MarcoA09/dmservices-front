import React from 'react'

const Reserved = ({ bookingData, user, logout, reserved }) => {

    if (!reserved || Object.keys(reserved).length === 0) {
        return <div className="loading">Cargando detalles de la reserva...</div>;
      }

      const reserveData = reserved.reserve || {};
      const serviceAddres = reserveData.adress; 

      const serviceNumber = reserveData._id; 
      const serviceFolio = "#" + serviceNumber.slice(-5).toUpperCase();

    function formatDate(date) {
        return new Date(date).toLocaleDateString();
      }
  return (
    <div>

<section class=" py-8 antialiased dark:bg-gray-900 md:py-16">
  <div class="mx-auto max-w-2xl px-4 2xl:px-0">
      <h2 class="text-xl font-semibold text-white dark:text-white sm:text-2xl mb-2">¡Gracias por reservar!</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">Tu reserva <a href="#" class="font-medium text-yellow-500 dark:text-white hover:underline">{serviceFolio}</a> fue procesada. Nos contactaremos a la brevedad para los detalles del contrato.</p>
      <div class="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Fecha</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end">{formatDate(bookingData.date)}</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Hora de inicio</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end">{bookingData.time}</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Nombre de quien reserva</dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
  {user?.name || 'Usuario'}
</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Dirección</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end"> {serviceAddres || 'No establecida, vaya a perfil'}</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Teléfono</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end"> {user?.phone || 'Telefono'}</dd>
          </dl>
      </div>
      <div class="flex items-center space-x-4">
          <a href="/profile" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Revisa tu información completa y de tus reservas ingreseando a:</a>
          <a href="/profile" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Mi perfil</a>
      </div>
  </div>
</section>

    </div>
  )
}

export default Reserved;
