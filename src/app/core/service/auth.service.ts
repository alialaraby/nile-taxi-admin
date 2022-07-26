import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Constant } from "../model/constant";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService extends DataService {

    constructor(http: HttpClient, private _http: HttpClient) {
        super(http);
    }

    login(data: any) {
        return this._http.post(environment.baseUrl + Constant.LOGIN, data);
            // .pipe(catchError(this.HandleError));
    }

}