import { BoatStatus, FuelType } from "./enums";
import { IPilot } from "./pilot";

export interface IBoat {
    _id: string;
    boatName: string;
    serial: string;
    model: string;
    capacity: number; // no. of seats in the boat
    lastMaintenanceDate: Date;
    hoursNeededForMaintenance: number;
    hoursTraveled: number;
    status: BoatStatus;
    assignedPilotId: IPilot;
    fuelCapacity: number;
    fuelType: FuelType;
    expectedFuelConsumption: number;
    needsMaintenance: boolean;
    isActive: boolean;
    createdAt: Date;

    type: string;
    modelYear: string;
    launchDate: string;
    length: number;
    beam: string;
    license: string;
    licenseRenewalDate: string;
    image: string;
    engineBrand: string;
    engineModel: string;
    engineModelYear: string;
    engineSerial: string;
    engineHours: number;
    topSpeed: number;
    averageSpeed: number;
}