import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { EmergencyType } from "../model/enums";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class EmergencyService extends DataService {

    constructor(http: HttpClient, private _http: HttpClient) {
        super(http);
    }

    public getemergencies(url: string, types: EmergencyType[], pageIndex: number = 0, pageSize: number = 10): Observable<Object> {
        return this._http.post(environment.baseUrl + url, {types, pageIndex, pageSize})
            .pipe(catchError(this.handleError));
    }

}