import { PaymentMethods, PaymentTransactionTypes } from "./enums";
import { IPackage } from "./package";
import { IPassenger } from "./passenger";
import { ITrip } from "./trip";

export interface IPaymentTransaction {
    package: IPackage;
    passenger: IPassenger;
    trip: ITrip;
    paymentMethod: PaymentMethods;
    paymentStatus: string;
    promoCode: string;
    paidAmount: number;
    numberOfSeats: number;
    transaction: any;
    order: any;
    isDeleted: boolean;
    createdAt: Date;
    transactionType: PaymentTransactionTypes;
}