import { IPassenger } from "./passenger";

export interface IPoolingReservation {
    _id: string;
    passenger: IPassenger;
    poolingTripRequest: string;
    numberOfSeats: number;
    price: number;
    isBooked: boolean;
    isDeleted: boolean;
    isCancelled: boolean;
}