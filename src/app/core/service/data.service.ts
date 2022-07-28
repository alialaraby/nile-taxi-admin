import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError } from 'rxjs/operators';
import { BadRequestError } from "../app-error/bad-request-error";
import { NotFoundError } from "../app-error/not-found-error";
import { UnAuthorizedError } from "../app-error/unauthorized-error";
import { AppError } from "../app-error/app-error";
import { DuplicateItemError } from "../app-error/duplicate-item-error";

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private http: HttpClient) { }

    public GetAll(url: string): Observable<Object> {
        return this.http.get(environment.baseUrl + url)
            .pipe(catchError(this.HandleError));
    }

    public GetById(url: string, Id: number, headers: any, data: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url + Id, data, headers)
            .pipe(catchError(this.HandleError));
    }

    public Add(url: string, item: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url, item)
            .pipe(catchError(this.HandleError));
    }

    public Update(url: string, item: any, headers: any) {
        return this.http.post(environment.baseUrl + url, item, headers)
            .pipe(catchError(this.HandleError));
    }

    public Delete(url: string, data: any, headers: any): Observable<Object> {
        return this.http.post(environment.baseUrl + url, data, headers)
            .pipe(catchError(this.HandleError));
    }

    protected HandleError(error: Response) {

        switch (error.status) {
            case 400:
                return throwError(new BadRequestError(error));
            case 409:
                return throwError(new DuplicateItemError(error));
            case 404:
                return throwError(new NotFoundError(error));
            case 401:
                return throwError(new UnAuthorizedError(error));
            default:
                return throwError(new AppError(error));
        }
    }
}