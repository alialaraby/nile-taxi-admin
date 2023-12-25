import { RequestedTripStatus } from "./enums";
import { IPassenger } from "./passenger";
import { IPoolingReservation } from "./pooling-reservation";
import { IStation } from "./station";

export interface IPoolingTripRequest {
    _id: string;
    pickupStation: IStation;
    terminalStation: IStation;
    trip: string;
    status: RequestedTripStatus;
    reservations: IPoolingReservation[];
    totalSeats: number;
    pickupDate: Date;
    isRoundTrip: boolean;
    isBooked: boolean;
    isDeleted: boolean;
    isCancelled: boolean;
    passenger?: IPassenger;
}