import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Admin } from "../model/admin";

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {

    userData = new BehaviorSubject<Admin>(new Admin());
    userData$ = this.userData.asObservable();

    authenticated = new BehaviorSubject<boolean>(false);
    authenticated$ = this.authenticated.asObservable();

    constructor() {
        if (localStorage.getItem('accessToken')) {
            this.setuserData(
                new Admin(
                    localStorage.getItem('_id'), 
                    localStorage.getItem('accessToken'),
                )
            );
            this.setauthenticated(true);
        } else {
            this.setauthenticated(false);
        }
    }

    setuserData(userData: Admin) {
        this.userData.next(userData);
    }
    setauthenticated(authenticated: boolean) {
        this.authenticated.next(authenticated);
    }

}