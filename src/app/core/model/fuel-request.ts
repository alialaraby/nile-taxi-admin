import { IBoat } from "./boat";
import { IPilot } from "./pilot";

export interface IFuelRequest {
    _id: string;
    liters: number;
    fuelRequestDate: Date;
    pilot: IPilot;
    boat: IBoat;
    isAccepted: boolean;
    isCompleted: boolean;
    createdAt: Date;
}