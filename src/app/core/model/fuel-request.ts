import { IPilot } from "./pilot";

export interface IFuelRequest extends Document {
    _id: string;
    liters: number;
    fuelRequestDate: Date;
    pilot: IPilot;
    isAccepted: boolean;
    isCompleted: boolean;
    createdAt: Date;
}