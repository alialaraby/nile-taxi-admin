import { TripStatus, TripTypes } from "./enums";
import { IPilot } from "./pilot";
import { IStation } from "./station";
import { ITripCategory } from "./tour-category";

export interface ITrip {
    _id?: string;
    code: string;
    type: TripTypes;
    pickupStation: IStation;
    terminalStation: IStation;
    endStation: IStation;
    pilot: IPilot;
    price: string;
    subPrice: string;
    discount: string;
    pickupDate: Date;
    terminalDate: Date;
    status: TripStatus;
    currentStation: IStation;
    category: ITripCategory;
    description: string;
    tourImage: string[];
    passengersReservingTrip: number; // No. of passengers reserving this trip
    onBoardedPassengers: number; // counts No. of passengers getting on the boat during the trip
    isFull: boolean;
    isCompleted: boolean;
    isDeleted: boolean;
    isActive: boolean;
    stations: any[];
    createdAt: Date;
    isRepeatedDaily: boolean;

    pickupDateYear?: string;
    pickupDateMonth?: string;
    pickupDateDay?: string;
    pickupDateHour?: string;
    pickupDateMinute?: string;
    
    terminalDateYear?: string;
    terminalDateMonth?: string;
    terminalDateDay?: string;
    terminalDateHour?: string;
    terminalDateMinute?: string;
}