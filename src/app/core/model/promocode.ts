import { Genders, PromocodeType } from "./enums";

export interface IPromocode {
    _id?: string;
    code: string;
    noOfUsers: number;
    noOfRidesPerUser: number;
    discountPercentage: number;
    validFrom: Date;
    validTo: Date;
    type: PromocodeType;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: Date;

    validFromDateYear?: number;
    validFromDateMonth?: number;
    validFromDateDay?: number;

    validToDateYear?: number;
    validToDateMonth?: number;
    validToDateDay?: number;
    gender: Genders;

}