import axios from "./axios";

export const reservedRequest = async (dataToSend) => axios.post(`/createreservation`, dataToSend);

export const getReservesDates = async () => axios.get(`/reservations/dates`);

export const getReservesUser = async (id) => axios.get(`/reserves/${id}`);

