import { IBoat } from "./boat";
import { Genders } from "./enums";

export class PilotWithBoat {
    _id: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    gender: Genders;
    dateOfBirth: string;
    inBreak: boolean;

    codeName: string;
    username: string;
    licenseType: string;
    licenseNumber: string;
    licenseIssuingDate: string;
    licenseExpirationDate: string;
}