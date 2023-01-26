import { IStation } from "./station";

export interface ITripRoute {
    _id: string;
    name: string;
    ID: string;
    image: string;
    description: string;
    stops: IRouteStop[];
    
    // tourRoute: boolean;
    isDeleted: boolean;
    isActive: boolean;
}

export interface IRouteStop {
    stopId: string;
    stop: IStation;
    order: number;
    waitingTime: number; // time a boat waits in the current stop (to drop off and pick up passengers) in minutes
    timeTilNextStop: number; // in minutes
    stopHeading: IStation;

    // arrivalTime: string;
    // departureTime: string;
    // timeBetweenStations: string;
}