import { BoatStatus, FuelType } from "./enums";
import { IPilot } from "./pilot";

export interface IBoat {
    _id: string;
    boatName: string;
    serial: string;
    model: string;
    capacity: number; // no. of seats in the boat
    lastMaintenanceDate: Date;
    kilosNeededForMaintenance: number;
    kilosTravelled: number;
    status: BoatStatus;
    assignedPilotId: IPilot;
    fuelCapacity: number;
    fuelType: FuelType;
    needsMaintenance: boolean;
    isActive: boolean;
    createdAt: Date;
}