import React, { useState } from 'react';
import { useReserves } from '../../../Context/reservesContext';

const CardPaymethod = ({amount, onPaymentConfirmed, onBack}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardNumberValid, setIsCardNumberValid] = useState(false);
  const { reserves, reservesDates, message, errors: reservedErrors  } = useReserves();
   const [payError, setPayError] = useState("");
  
  const validateCardNumber = (number) => {
    if (!number) return false;
    
    const cleaned = number.toString().replace(/\D/g, '');
    if (cleaned.length !== 16) return false;
    if (!/^\d+$/.test(cleaned)) return false;
    return true;
  };

  const validateExpiryDate = (date) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;
    
    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const numMonth = parseInt(month, 10);
    const numYear = parseInt(year, 10);

    if (numMonth < 1 || numMonth > 12) return false;
    if (numYear < currentYear) return false;
    if (numYear === currentYear && numMonth < currentMonth) return false;

    return true;
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

   const formatCardNumber = (value) => {
    if (!value) return '';
    
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.substring(0, 16);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };
  

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    
    setIsCardNumberValid(validateCardNumber(formatted));
  };
  const handleExpiryDateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d/]/g, '');
    
    if (value.length === 2 && expiryDate.length === 1) {
      value += '/';
    }

    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message) {
      setPayError(message); 
    }
    
    const newErrors = {};
    
    if (!cardName.trim()) {
      newErrors.cardName = "El nombre del titular es obligatorio";
    }
    
    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }
    
    if (!validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = "Fecha de expiración inválida";
    }
    
    if (!validateCVV(cvv)) {
      newErrors.cvv = "CVV inválido";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsProcessing(true);
  
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentConfirmed();
    }, 2000);
  };


  return (
    <div>

<div className="mx-auto max-w-4xl text-center">
      <h1 className="mt-2 font-bold text-white sm:text-5xl">
      Esto no es un pago, es la forma de darte lo mejor para ese día.
      </h1>
    </div>
    <p className="mx-auto mt-6 text-center font-medium text-pretty text-white font-size-8">
    Por favor, realiza el pago del monto indicado para concretar tu reserva, el monto es calculado de acuerdo al tipo de evento elegido.
    </p>

  <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div className="mx-auto max-w-5xl">

      <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
        <form onSubmit={handleSubmit} className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="cardName" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Nombre en la tarjeta </label>
              <input type="text" id="cardName"
            value={cardName}  onChange={(e) => setCardName(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Juan Perez" required />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="cardNumber" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Tarjeta </label>
              <input type="text"  id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxx-xxxx-xxxx-xxxx" />
            </div>

            <div>
              <label htmlFor="expiryDate" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Fecha de expiración </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                  <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input datepicker datepicker-format="mm/yy"  id="expiryDate"
              value={expiryDate}
              onChange={handleExpiryDateChange} type="text" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="12/23" required />
              </div>
            </div>
            <div>
              <label htmlFor="cvv" className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                CVV*
                <button data-tooltip-target="cvv-desc" data-tooltip-trigger="hover" className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white">
                  <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
                  </svg>
                </button>
                <div id="cvv-desc" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                  The last 3 digits on back of card
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </label>
              <input type="number"  id="cvv"
              value={cvv}
              onChange={handleCVVChange} aria-describedby="helper-text-explanation" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="•••" required />
            </div>
          </div>

        {/*   <button type="submit" class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Pay now</button> */}
        <div className="form-buttons text-black text-center">
       
          <button 
            type="button" 
            onClick={onBack} 
            className="className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-11 mb-5'"
            disabled={isProcessing}
          >
            Volver
          </button>
          
          <button 
            type="submit" 
            className="className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-11 mb-5'"
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : `Pagar ${amount}`}
          </button>
          {payError && (
                  <div style={{ color: payError ? "red" : "green", marginTop: "10px" }}>
                    {payError}
                  </div>
                )}
        </div>
       
        </form>

        <div class="mt-6 grow sm:mt-8 lg:mt-0">
          <div class="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="space-y-2">
              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Costo de servicio</dt>
                <dd class="text-base font-medium text-gray-900 dark:text-white">{amount}</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Descuento</dt>
                <dd class="text-base font-medium text-green-500">-$0.00</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Adicionales</dt>
                <dd class="text-base font-medium text-gray-900 dark:text-white">$0.00</dd>
              </dl>

{/*               <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Tax</dt>
                <dd class="text-base font-medium text-gray-900 dark:text-white">$799</dd>
              </dl> */}
            </div>

            <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt class="text-base font-bold text-gray-900 dark:text-white">Total a pagar</dt>
              <dd class="text-base font-bold text-gray-900 dark:text-white">{amount}</dd>
            </dl>
          </div>

          <div class="mt-6 flex items-center justify-center gap-8">
            <img class="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg" alt="" />
            <img class="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal-dark.svg" alt="" />
            <img class="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="" />
            <img class="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg" alt="" />
            <img class="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="" />
            <img class="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg" alt="" />
          </div>
        </div>
      </div>

      <p class="mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 lg:text-left">
        Payment processed by <a href="#" title="" class="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Paddle</a> for <a href="#" title="" class="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Flowbite LLC</a>
        - United States Of America
      </p>
    </div>
  </div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"></script>
    </div>
  )
}

export default CardPaymethod;
