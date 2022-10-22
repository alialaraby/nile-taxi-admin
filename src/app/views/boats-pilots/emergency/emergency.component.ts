import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { IEmergency } from 'src/app/core/model/emergency';
import { EmergencyType } from 'src/app/core/model/enums';
import { EmergencyService } from 'src/app/core/service/emergency.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss']
})
export class EmergencyComponent implements OnInit {

  emergencies: IEmergency[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  emergencyTypes = [EmergencyType.Emergency, EmergencyType.Maintenance];
  selectedTypes: EmergencyType[];
  defaultType: boolean = true;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private emergencyService: EmergencyService
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

  getAll(pageIndex: number = 0, pageSize: number = 10, types: EmergencyType[] = this.emergencyTypes) {
    this.emergencyService.getemergencies(Constant.GET_EMERGENCIES, types, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.emergencies = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

  filterTypes(selectedType: string) {
    this.defaultType = false;
    let type = Object.values(EmergencyType).find(x => x == selectedType);
    this.selectedTypes = type ? [type] : this.emergencyTypes;

    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedTypes);
  }

  resetFilters() {
    this.defaultType = true;
    this.getAll(this.pageIndex - 1, this.pageSize);
  }

}
