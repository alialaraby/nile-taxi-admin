import { Genders } from "./enums";

export interface IPassenger extends Document {
    _id: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    location: any;
    // country: string;
    // city: string;
    // notificationToken: string;
    // accessToken: string;
    gender: Genders;
    // dateOfBirth: string;
    createdAt: Date;
    // password: string;
    // OTP: string;
    // lastOTPTime: Date;
    // isDeleted: boolean;
    // isVerified: boolean;
}