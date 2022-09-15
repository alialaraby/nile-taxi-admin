import { IBoat } from "./boat";
import { Genders } from "./enums";

export class PilotWithBoat {
    _id: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    gender: Genders;
    // boat: IBoat;

    // boatName: string;
    // boatModel: string;
    // boatCapacity: number; // no. of seats in the boat
}