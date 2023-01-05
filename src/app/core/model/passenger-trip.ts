import { PassengerStatus, PaymentMethods, TripStatus } from "./enums";
import { IPassenger } from "./passenger";
import { ITrip } from "./trip";

export interface IPassengerTrip{
    trip: ITrip;
    passenger: IPassenger;
    numberOfSeats: number;
    promoCode: string;
    paymentMethod: PaymentMethods;
    paidAmount: number;
    reservationCode: string;
    status: TripStatus;
    passengerStatus: PassengerStatus;
    isOnboarded: boolean;
    isCompleted: boolean;
    isCancelledByPassenger: boolean;
    isCancelledByPilot: boolean;
    isDeleted: boolean;
    isWalkInUser: boolean;
}