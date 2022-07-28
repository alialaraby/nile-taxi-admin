import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { IPilot } from 'src/app/core/model/pilot';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {

  pilots: IPilot[] = [];
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
    this.dataService.GetAll(Constant.GET_PILOTS)
    .subscribe(
      (res: any) => {
        this.pilots = res.items;
        this.gettingData = false;
      },
      (error) => {
        this.gettingData = false;
        this._responseHandler.HandelError(error);
      }
    );
  }

}
