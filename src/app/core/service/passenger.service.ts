import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Constant } from "../model/constant";
import { UserType } from "../model/enums";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class PassengerService extends DataService {

    constructor(http: HttpClient, private _http: HttpClient) {
        super(http);
    }

    public getPassengers(url: string, types: UserType[], pageIndex: number = 0, pageSize: number = 10): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {types, pageIndex, pageSize})
            .pipe(catchError(this.handleError));
    }

    respondStudentRequest(data: any) {
        return this._http.post(environment.baseUrl + Constant.RESPOND_STUDENT_REQUEST, data);
    }

}