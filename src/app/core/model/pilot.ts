import { IBoat } from "./boat";
import { Genders } from "./enums";

export interface IPilot {
    _id: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    boat: IBoat;
    createAt: Date;
    // location: any;
    // notificationToken: string;
    // accessToken: string;
    // boat: IBoat;
    // country: string;
    // city: string;
    gender: Genders;
    // dateOfBirth: string;
    // isDeleted: boolean;
    inBreak: boolean;
}