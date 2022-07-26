import { BoatStatus } from "./enums";

export interface IBoat {
    _id: string;
    boatName: string;
    model: string;
    capacity: number; // no. of seats in the boat
    lastMaintenanceDate: Date;
    kilosNeededForMaintenance: number;
    kilosTravelled: number;
    status: BoatStatus;
    needsMaintenance: boolean;
    isActive: boolean;
    createdAt: Date;
}