import { EmergencyType } from "./enums";
import { IPilot } from "./pilot";

export interface IEmergency {
    _id: string;
    emergency: string;
    emergencyType: EmergencyType;
    pilot: IPilot;
    createdAt: Date;
}