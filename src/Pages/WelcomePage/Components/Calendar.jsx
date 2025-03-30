import React, { useState, useEffect } from 'react';
import { useReserves } from '../../../Context/reservesContext';

const Calendar = ({onSelectDateTime, onBack}) => {
  const { reserves, reservesDates, message, errors: reservedErrors, startLongPolling  } = useReserves();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('12:00 PM');
  const [eventAddress, setEventAddress] = useState('');
  const [occupiedDates, setOccupiedDates] = useState([])
/*   const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());  */ 
 const [contactError, setContactError] = useState("");


  useEffect(() => {
    if (reserves && reserves.length > 0) {

      const formattedOccupiedDates = reserves.map(reserve => {
        const reserveDate = new Date(reserve.date);
        return `${reserveDate.getFullYear()}-${reserveDate.getMonth()}-${reserveDate.getDate()}`;
      });
      
      setOccupiedDates(formattedOccupiedDates);
    }
  }, [reserves]);

/*   useEffect(() => {
    startLongPolling();  
  }, [startLongPolling]); */
  
  useEffect(() => {
    reservesDates();
  }, [reservesDates]); 

  


  const handleConfirm = () => {
    if (selectedDate && selectedHour && eventAddress) {
      onSelectDateTime(selectedDate, selectedHour, eventAddress);
      setContactError(""); 
    } else {
      setContactError("Por favor selecciona fecha, hora o añade tu dirección"); 
    }
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  };
  
  const hours = Array.from({ length: 24 }, (_, i) => formatHour(i));
  

  
  const handleHourChange = (formattedHour) => {
    setSelectedHour(formattedHour);
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const currentDay = selectedDate.getDate();
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const days = daysInMonth(currentYear, currentMonth);
  const firstDay = firstDayOfMonth(currentYear, currentMonth);
  
  const prevMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const nextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const handleDayClick = (day) => {
    const dateString = `${currentYear}-${currentMonth}-${day}`;
    if (!occupiedDates.includes(dateString)) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    }
  };

  const isDateOccupied = (day) => {
    const dateString = `${currentYear}-${currentMonth}-${day}`;
    return occupiedDates.includes(dateString);
  };


  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }
  
  for (let i = 1; i <= days; i++) {
    const isSelected = i === currentDay;
    const isOccupied = isDateOccupied(i);
    
    calendarDays.push(
      <div
        key={`day-${i}`}
        onClick={() => !isOccupied && handleDayClick(i)}
        className={`h-10 w-10 flex items-center justify-center rounded-full 
          ${isSelected ? 'bg-primary text-primary-content' : ''}
          ${isOccupied 
            ? 'bg-red-200 text-red-800 cursor-not-allowed line-through' 
            : 'hover:bg-base-200 cursor-pointer'}`}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="w-full">

<div className="mx-auto max-w-4xl text-center">
      <h1 className="mt-2 font-bold text-white sm:text-5xl">
        Elige la fecha que será inolvidable
      </h1>
    </div>

    <p className="mx-auto mt-6 text-center font-medium text-pretty text-white font-size-8 mb-5">
    Escribe la dirección exacta, selecciona el día y hora. Por favor elige la hora exacta de inicio, nosotros consideraremos el tiempo de instalación:
    </p>

    <div className="mx-auto max-w-4xl text-center">
    <input type='text' value={eventAddress} onChange={(e) => setEventAddress(e.target.value)}
        className="grow h-12 w-full pl-10 mb-3 bg-black/10 rounded-full border border-zinc-700 focus:outline-none focus:border-[#ff0080] text-white" placeholder="Dirección del evento"  />
         {contactError && (
                  <div style={{ color: contactError ? "red" : "green", marginTop: "10px" }}>
                    {contactError}
                  </div>
                )}
          <button 
            type="button" 
            onClick={onBack} 
            className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-11 mb-5 mr-2'
          >
            Volver
          </button>
      <button onClick={handleConfirm} className='btn btn-wide bg-gradient-to-r from-[#ff0080] to-[#a10151] hover:bg-gradient-to-r hover:from-[#b8025d] hover:to-[#781685] border-0 text-white font-bold hover:bg-purple-800 sm:px-8 sm:py-3 rounded-4xl my-1 shadow-none h-11 mb-5'>
        Confirmar
          </button>
    </div>

      <div className="flex flex-row rounded-box overflow-hidden w-full">
        
        <div className="p-4 rounded-l-box flex-1 border border-base-300 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Calendario</h2>
          
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="btn btn-sm btn-circle btn-ghost">
              <svg className="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
            </button>
            <div className="text-lg font-medium">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button onClick={nextMonth} className="btn btn-sm btn-circle btn-ghost">
              <svg className="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays}
          </div>
        </div>
        
        <div className="p-4 rounded-r-box flex-1 border border-base-300 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Horas</h2>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-lg font-semibold">{selectedHour}</span>
            </div>
            
            <div className="mt-4 flex flex-col gap-2 h-64 overflow-y-auto w-full">
              {hours.map(hour => (
                <div 
                  key={hour}
                  className={`p-2 text-center cursor-pointer rounded-md transition-colors ${selectedHour === hour ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                  onClick={() => setSelectedHour(hour)}
                >
                 {hour}
                </div>
              ))}
              
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;