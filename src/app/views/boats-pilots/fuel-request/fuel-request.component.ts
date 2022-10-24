import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IFuelRequest } from 'src/app/core/model/fuel-request';
import { DataService } from 'src/app/core/service/data.service';
import { FuelRequestService } from 'src/app/core/service/fuel-request.service';
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
  approveRequest: boolean = true;
  selectedRequest: IFuelRequest;
  isEditItem: boolean = false;
  fuelRequestToEditId: string;
  addEditForm: FormGroup;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(
    private dataService: DataService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
    private fuelRequestService: FuelRequestService
  ) {
    this.sharedData.userData$.subscribe(
      (userData) => {
        this.sharedUserData._id = userData._id;
        this.sharedUserData.accessToken = userData.accessToken;
        this.sharedUserData.role = userData.role;
        this.sharedUserData.isSuperAdmin = userData.isSuperAdmin;
        this.sharedUserData.isAdmin = userData.isAdmin;
        this.sharedUserData.isCorporateAdmin = userData.isCorporateAdmin;
        this.sharedUserData.isAnalystAdmin = userData.isAnalystAdmin;
      }
    );
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_FUEL_REQUESTS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.fuelRequests = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openApproveModal(modal: any, item: IFuelRequest, approved: boolean) {
    this.selectedRequest = item;
    this.approveRequest = approved as boolean
    this.modalService.open(modal, { size: 'sm' });
  }

  submit() {
    this.fuelRequestService.approveReject({ _id: this.selectedRequest._id, approved: this.approveRequest })
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Done);
          this.getAll();
          this.modalService.dismissAll();
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
        }
      );
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

}
