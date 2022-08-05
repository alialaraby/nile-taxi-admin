import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Constant } from "../model/constant";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class FuelRequestService extends DataService {

    constructor(http: HttpClient, private _http: HttpClient) {
        super(http);
    }

    approveReject(data: any) {
        return this._http.post(environment.baseUrl + Constant.APPROVE_REJECT_FUEL_REQUESTS, data);
    }

}