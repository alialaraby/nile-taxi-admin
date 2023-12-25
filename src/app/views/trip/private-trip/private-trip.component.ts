import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { IBoat } from 'src/app/core/model/boat';
import { Constant } from 'src/app/core/model/constant';
import { RequestedTripStatus, ResponseActionType, TripStatus, TripTypes } from 'src/app/core/model/enums';
import { IPilot } from 'src/app/core/model/pilot';
import { IPoolingTripRequest } from 'src/app/core/model/pooling-trip-request';
import { IRequestedTrip } from 'src/app/core/model/requested-trip';
import { DataService } from 'src/app/core/service/data.service';
import { RequestedTripService } from 'src/app/core/service/requested-trip.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-private-trip',
  templateUrl: './private-trip.component.html',
  styleUrls: ['./private-trip.component.scss']
})
export class PrivateTripComponent implements OnInit {

  // pilots: IPilot[] = [];
  boats: IBoat[] = [];
  // selectedPilotId: string = '';
  selectedBoatId: string = '';
  selectedPrice: string = '';
  requestedTrips: IRequestedTrip | IPoolingTripRequest[] = [];
  selectedTripDetails: IRequestedTrip | IPoolingTripRequest;

  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  selectedRequest: IRequestedTrip | IPoolingTripRequest;
  isEditItem: boolean = false;
  requestToEditId: string;
  addEditForm: FormGroup;
  // requestStatuses = [RequestedTripStatus.Accepted, RequestedTripStatus.Pending, RequestedTripStatus.Rejected];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  typeEnum = TripTypes;
  tripTypes = [TripTypes.Private, TripTypes.Pooling];
  selectedTypes = [TripTypes.Private, TripTypes.Pooling];
  selectedType = TripTypes.Private;
  tripStatuses = Object.values(RequestedTripStatus);
  selectedStatuses = Object.values(RequestedTripStatus);

  sendingRequest: boolean = false;

  constructor(
    private requestedTripService: RequestedTripService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal
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
    this.getInitialData();
  }

  getInitialData() {
    this.requestedTripService.getAll(Constant.GET_BOATS).subscribe(
      (res: any) => {
        this.boats = res.items;
      }
    )
  }

  getAll(
    pageIndex: number = 0,
    pageSize: number = 10,
    statuses: RequestedTripStatus[] = this.tripStatuses,
    type: TripTypes = TripTypes.Private
  ) {
    this.requestedTripService.getRequestedTrips(Constant.GET_REQUESTED_TRIPS, type, statuses, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          console.log(res);
          
          this.requestedTrips = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  selectBoat(boatId: string) {
    this.selectedBoatId =boatId;
  }

  openApproveModal(modal: any, item: IRequestedTrip) {
    this.selectedBoatId = '';
    this.selectedPrice = '';
    this.selectedRequest = item;
    this.modalService.open(modal, { size: 'md' });
  }

  openRejectModal(modal: any, item: IRequestedTrip) {
    this.selectedRequest = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  getPrice(price) {
    this.selectedPrice = price;
  }

  rejectRequest() {
    this.sendingRequest = true;
    this.requestedTripService.approveReject(Constant.REJECT_REQUESTED_TRIP, { requestedTripId: this.selectedRequest._id })
      .subscribe(
        (res: any) => {
          this.sendingRequest = false;
          this._responseHandler.HandleSuccess(res, ResponseActionType.Done);
          this.getAll();
          this.modalService.dismissAll();
        },
        (error) => {
          this.gettingData = false;
          this.sendingRequest = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
        }
      );
  }

  approveRequest() {
    this.sendingRequest = true;
    this.requestedTripService.approveRequestedTrip(Constant.APPROVE_REQUESTED_TRIP, this.selectedRequest._id, this.selectedBoatId, +this.selectedPrice)
      .subscribe(
        (res: any) => {
          this.sendingRequest = false;
          this._responseHandler.HandleSuccess(res, ResponseActionType.Done);
          this.getAll();
          this.modalService.dismissAll();
        },
        (error) => {
          this.gettingData = false;
          this.sendingRequest = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
        }
      );
  }

  filterTypes(selectedType: string) {
    this.requestedTrips = [];
    let type = Object.values(TripTypes).find(x => x == selectedType);
    // this.selectedTypes = type ? [type] : [TripTypes.Private, TripTypes.Pooling];
    this.selectedType = type;
    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedType);
  }

  filterStatuses(selectedStatus: string) {
    let status = Object.values(RequestedTripStatus).find(x => x == selectedStatus);
    this.selectedStatuses = status ? [status] : Object.values(RequestedTripStatus);
    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedType);
  }

  resetFilters(){
    // this.selectedTypes = [TripTypes.Private, TripTypes.Pooling];
    this.selectedType = TripTypes.Private;
    this.selectedStatuses = Object.values(RequestedTripStatus);
    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedType);
  }

  openTripDetails(modal: any, trip: IRequestedTrip) {
    this.selectedTripDetails = trip;
    this.modalService.open(modal, { size: 'md' });
  }
  openReservationsDetails(modal: any, trip: IPoolingTripRequest) {
    this.selectedTripDetails = trip;
    this.modalService.open(modal, { size: 'md' });
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

  setReservationPrice(reservationId: string, price: number){
    if(price > 0){
      let itemIndex = this.selectedTripDetails['reservations'].findIndex(x => x._id == reservationId)
      if(itemIndex != -1)
        this.selectedTripDetails['reservations'][itemIndex].price = +price;
    }
  }

  checkMissingPrices(poolingRequest: any){
    return poolingRequest.reservations.find(x => x.price <= 0) != undefined ? true : false;
  }

  approvePoolingRequest(poolingRequest: IPoolingTripRequest, selectedBoatId: string){
    console.log({
      poolingRequest, selectedBoatId, selectedTripDetails: this.selectedTripDetails
    });
    this.sendingRequest = true;
    this.requestedTripService.approvePoolingRequest(Constant.APPROVE_POOLING_REQUEST, poolingRequest._id, selectedBoatId, this.selectedTripDetails)
      .subscribe(
        (res: any) => {
          this.sendingRequest = false;
          this._responseHandler.HandleSuccess(res, ResponseActionType.Done);
          this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedType);
          this.modalService.dismissAll();
        },
        (error) => {
          this.gettingData = false;
          this.sendingRequest = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
        }
      );
  }

  rejectPoolingRequest(requestId: string) {
    this.sendingRequest = true;
    this.requestedTripService.approveReject(Constant.REJECT_POOLING_REQUEST, { requestedTripId: requestId })
      .subscribe(
        (res: any) => {
          this.sendingRequest = false;
          this._responseHandler.HandleSuccess(res, ResponseActionType.Done);
          this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedType);
          this.modalService.dismissAll();
        },
        (error) => {
          this.gettingData = false;
          this.sendingRequest = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
        }
      );
  }

}
