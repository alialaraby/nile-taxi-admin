import { PackageType } from "./enums";

export interface IPackage {
    _id?: string;
    name: string;
    // noOfRides: number;
    price: number;
    expiresAfter: number; // in months
    isDeleted: boolean;
    doesntExpire: boolean;
    isActive: boolean;
    createdAt: Date;
    type: PackageType;

}