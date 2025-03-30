import React, { useState } from 'react';
import ServicesSection from './ServicesSection';
import Calendar from './Calendar';
import CardPaymethod from './CardPaymethod';
import Reserved from './Reserved';
import { useReserves } from '../../../Context/reservesContext';

function Steps({ user, logout }) {
  const [activeStep, setActiveStep] = useState(1);
  const { createBooking, reserved, message, errors: reservedErrors } = useReserves();
  
  const [bookingData, setBookingData] = useState({
    serviceOption: null,
    serviceCost: 0,
    date: null,
    time: null,
    adress: null,
    paymentConfirmed: false
  });

  const updateBookingData = (newData) => {
    setBookingData(prevData => ({ ...prevData, ...newData }));
  };

  const nextStep = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const completeBooking = async () => {
    try {
      const completeData = {
        ...bookingData,
        status: "pending", 
        payment_status: "pending", 
        adress: bookingData.address || bookingData.adress 
      };
      
      await createBooking(completeData);
      nextStep(); 
    } catch (errors) {
      console.error("Error al completar la  :", errors);
    
    }
  };

  const stepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <ServicesSection 
            selectService={(option, cost) => {
              updateBookingData({ serviceOption: option, serviceCost: cost });
              nextStep();
            }}
          />
        );
      case 2:
        return (
          <Calendar 
            onSelectDateTime={(date, time, adress) => {
              updateBookingData({ date, time, adress });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <CardPaymethod 
            amount={bookingData.serviceCost}
            onPaymentConfirmed={() => {
              updateBookingData({ paymentConfirmed: true });
              completeBooking(); 
            }}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Reserved 
            bookingData={bookingData}
            user={user}
            logout={logout}
            reserved={reserved}
          />
        );
      default:
        return <ServicesSection />;
    }
  };

  return (
    <div className="steps-container">
      <div className="step-indicator">
        Paso {activeStep} de 4
      </div>
      {stepContent()}
    </div>
  );
}

export default Steps;