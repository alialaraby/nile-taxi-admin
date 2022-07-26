import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { IStation } from 'src/app/core/model/station';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {

  stations: IStation[] = [];
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
    this.dataService.GetAll(Constant.GET_STATIONS, headers)
    .subscribe(
      (res: any) => {
        this.stations = res.items;
        this.gettingData = false;
      },
      (error) => {
        this.gettingData = false;
        this._responseHandler.HandelError(error);
      }
    );
  }

}
