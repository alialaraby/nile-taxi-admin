import { IPassenger } from "./passenger";

export interface IComplain {
    _id?: string;
    complain: string;
    passenger: IPassenger;
    isDeleted: boolean;
    isResolved: boolean;
    createdAt: Date;
}