import React, { useEffect, useState } from 'react';
import { useReserves } from '../../Context/reservesContext';
import { useAuth } from "../../Context/authContext";
import Navbar from '../../Layouts/Navbar'
import { Backforms } from '../../ComponentsUI/Backforms'

export const MyReservsPage = () => {
    const { reserves, reservesDates, message, errors: reservedErrors, startLongPolling, reservesuserres, reservesUser  } = useReserves();
    const { user, isAuthenticated, logout } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const getReservas = async () => {
          setLoading(true); 
          await reservesUser(user.id); 
          setLoading(false);
        };
    
        getReservas();
      }, [user, reservesUser]);
    
      if (loading) {
        return <div>Loading...</div>;
      }


    return (

        

        <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
        <Backforms />
        <Navbar user={user} logout={logout} />
        
        <div className="flex-1 flex flex-col items-start bg-black px-6 py-5 sm:py-15 lg:px-8">
          <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>
      
          {reservesuserres.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-gray-300">
                <thead>
                  <tr>
                    <th className="border-b py-2 px-4">Fecha</th>
                    <th className="border-b py-2 px-4">Hora</th>
                    <th className="border-b py-2 px-4">Servicio</th>
                    <th className="border-b py-2 px-4">Estado</th>
                    <th className="border-b py-2 px-4">Pago</th>
                    <th className="border-b py-2 px-4">Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {reservesuserres.map((reserva) => (
                    <tr key={reserva._id}>
                      <td className="border-b py-2 px-4">{new Date(reserva.date).toLocaleDateString()}</td>
                      <td className="border-b py-2 px-4">{reserva.time}</td>
                      <td className="border-b py-2 px-4">{reserva.service}</td>
                      <td className="border-b py-2 px-4">{reserva.status}</td>
                      <td className="border-b py-2 px-4">{reserva.payment_status}</td>
                      <td className="border-b py-2 px-4">{reserva.adress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No tienes reservas.</p>
          )}
        </div>
      </div>
      


    );
  };