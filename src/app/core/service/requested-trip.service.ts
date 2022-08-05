import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { RequestedTripStatus } from "../model/enums";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class RequestedTripService extends DataService {

    constructor(http: HttpClient, private _http: HttpClient) {
        super(http);
    }

    public getRequestedTrips(url: string, statuses: RequestedTripStatus[], pageIndex: number = 0, pageSize: number = 10): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {statuses , pageIndex, pageSize})
            .pipe(catchError(this.handleError));
    }

    public approveRequestedTrip(url: string, requestedTripId: string, pilotId: string, price: number): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {requestedTripId, pilotId, price})
            .pipe(catchError(this.handleError));
    }

}