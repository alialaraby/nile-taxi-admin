import { IStation } from "./station";

export interface ITripRoute {
    _id: string;
    name: string;
    ID: string;
    image: string;
    description: string;
    stops: IRouteStop[];
    
    isDeleted: boolean;
    isActive: boolean;
}

export interface IRouteStop {
    stopId: string;
    stop: IStation;
    order: number;
    arrivalTime: string;
    departureTime: string;
    stopHeading: IStation;
    timeBetweenStations: string;
}