import { Genders } from "./enums";

export class Admin {

    constructor(
        _id?: string, 
        _accessToken?: string, 
    ) {
        this._id = _id;
        this.accessToken = _accessToken;
    }

    _id: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    password: string;
    accessToken: string;
    gender: Genders;
    dateOfBirth: string;
    createAt: Date;
}