import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { RequestedTripStatus, TripTypes } from "../model/enums";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class RequestedTripService extends DataService {

    constructor(http: HttpClient, private _http: HttpClient) {
        super(http);
    }

    public getRequestedTrips(url: string, type: TripTypes, statuses: RequestedTripStatus[], pageIndex: number = 0, pageSize: number = 10): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {statuses, type, pageIndex, pageSize})
            .pipe(catchError(this.handleError));
    }

    public approveRequestedTrip(url: string, requestedTripId: string, boatId: string, price: number): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {requestedTripId, boatId, price})
            .pipe(catchError(this.handleError));
    }

    public approvePoolingRequest(url: string, requestedTripId: string, boatId: string, poolingRequest: any): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {requestedTripId, boatId, poolingRequest})
            .pipe(catchError(this.handleError));
    }

}