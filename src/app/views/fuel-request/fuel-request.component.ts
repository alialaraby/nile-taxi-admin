import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { IFuelRequest } from 'src/app/core/model/fuel-request';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-fuel-request',
  templateUrl: './fuel-request.component.html',
  styleUrls: ['./fuel-request.component.scss']
})
export class FuelRequestComponent implements OnInit {

  fuelRequests: IFuelRequest[] = [];
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

  getAll() {
    this.dataService.GetAll(Constant.GET_FUEL_REQUESTS)
      .subscribe(
        (res: any) => {
          console.log('resX', res);
          
          this.fuelRequests = res.items;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

}
