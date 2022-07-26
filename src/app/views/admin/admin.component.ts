import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  admins: Admin[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  constructor(
    private dataService: DataService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService
  ) { 
    this.sharedData.userData$.subscribe(
      (userData) => {
        this.sharedUserData._id = userData._id;
        this.sharedUserData.accessToken = userData.accessToken;
      }
    );
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    // const data = {'_id': this.sharedUserData._id};
    const headers = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedUserData.accessToken) }
    this.dataService.GetAll(Constant.GET_ADMINS, headers)
    .subscribe(
      (res: any) => {
        this.admins = res.items;
        this.gettingData = false;
      },
      (error) => {
        this.gettingData = false;
        this._responseHandler.HandelError(error);
      }
    );
  }

}
