import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react";
import { reservedRequest, getReservesDates, getReservesUser } from "../api/reserves.js";

const ReservesContext = createContext();

export const useReserves = () => {
    const context = useContext(ReservesContext);
    if (!context) throw new Error("useReserves must be used within a ReservesProvider");
    return context;
};

export const ReservedProvider = ({ children }) => {
    const [reserved, setReserved] = useState([]);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [reserves, setReserves] = useState([]);
    const [error, setError] = useState(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [reservesuserres, setReservesUser] = useState([]);

    // Usamos useRef para manejar la conexión WebSocket
    const ws = useRef(null);

    useEffect(() => {
        // Establecer conexión WebSocket
        ws.current = new WebSocket('ws://dmservices-front.vercel.app/');
        
        ws.current.onopen = () => {
            console.log('Conectado al WebSocket');
            setWsConnected(true);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.tipo === "actualizar-calendario") {
                reservesDates(); 
            }
        };

        ws.current.onerror = (err) => {
            setError('Error en WebSocket: ' + err.message);
        };

        ws.current.onclose = () => {
            console.log('Desconectado del WebSocket');
            setWsConnected(false);
        };

        return () => {
            if (ws.current) {
                ws.current.close();  // Asegurarse de cerrar la conexión al desmontar
            }
        };
    }, []);  // El useEffect solo se ejecuta una vez cuando el componente se monta

    const createBooking = async (bookingData) => {
        setLoading(true);
        setErrors(null);
        
        try {
            const dataToSend = {
                date: bookingData.date,
                time: bookingData.time,
                service: bookingData.serviceOption,
                status: bookingData.status || "pending",
                payment_status: bookingData.paymentConfirmed || "pending",
                adress: bookingData.adress || "No establecida"
            };

            const res = await reservedRequest(dataToSend);

            if (res.status === 201) {
                setReserved(res.data);
                setLoading(false);
                setMessage(res.data.message[0]);
                reservesDates(); 

                // Solo intentamos enviar el mensaje si WebSocket está conectado
                if (ws.current && wsConnected) {
                    ws.current.send(JSON.stringify({ tipo: "nueva-reserva" }));
                } else {
                    console.log('No se pudo enviar el mensaje, WebSocket no está conectado');
                }
            }
        } catch (error) {
            console.error("Error en createBooking:", error);
            setErrors(error.response?.data?.message || ["Error en la reserva"]);
            setLoading(false);
            throw error;
        }
    };

    const reservesDates = useCallback(async () => {
        try {
            const res = await getReservesDates();
            setReserves(res.data);
        } catch (error) {
            console.error('Error al obtener fechas reservadas:', error);
        }
    }, []);


    const reservesUser = useCallback(async (id) => {
        try {
            const res = await getReservesUser(id);
            setReservesUser(res.data);
            console.log(res.data)
        } catch (error) {
            console.error('Error al obtener fechas reservadas:', error);
        }
    }, []);

    return (
        <ReservesContext.Provider
            value={{
                reserved,
                createBooking,
                errors,
                loading,
                message,
                reservesDates,
                reservesUser,
                reserves,
                reservesuserres,
            }}
        >
            {children}
        </ReservesContext.Provider>
    );
};

export default ReservesContext;
