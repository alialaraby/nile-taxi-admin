import { RequestedTripStatus, TripTypes } from "./enums";
import { IPassenger } from "./passenger";
import { IStation } from "./station";

export interface IRequestedTrip {
    _id: string;
    passenger: IPassenger;
    pickupStation: IStation;
    terminalStation: IStation;
    numberOfSeats: number;
    status: RequestedTripStatus;
    type: TripTypes;
    pickupDate: Date;
    isRoundTrip: boolean;
    isDeleted: boolean;
    isCancelled: boolean;
    createdAt: Date;
}