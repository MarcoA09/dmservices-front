import axios from "./axios";

export const reservedRequest = async (dataToSend) => axios.post(`/api/createreservation`, dataToSend);

export const getReservesDates = async () => axios.get(`/api/reservations/dates`);

export const getReservesUser = async (id) => axios.get(`/api/reserves/${id}`);

