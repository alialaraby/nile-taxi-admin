import { ICorporateAccount } from "./corporate-account";
import { Genders } from "./enums";

export interface IPassenger {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    location: any;
    age: string;
    studentCertificate: string;
    type: string;
    // country: string;
    // city: string;
    // notificationToken: string;
    // accessToken: string;
    gender: Genders;
    // dateOfBirth: string;
    createdAt: Date;
    // password: string;
    passengerImage: string;
    corporateId?: ICorporateAccount;
    lastTripDate: string;
    // lastOTPTime: Date;
    // isDeleted: boolean;
    // isVerified: boolean;
}