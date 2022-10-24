import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { RequestedTripStatus, ResponseActionType, TripStatus, TripTypes } from 'src/app/core/model/enums';
import { IPilot } from 'src/app/core/model/pilot';
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

  pilots: IPilot[] = [];
  selectedPilotId: string = '';
  selectedPrice: string = '';
  requestedTrips: IRequestedTrip[] = [];
  selectedTripDetails: IRequestedTrip;

  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  selectedRequest: IRequestedTrip;
  isEditItem: boolean = false;
  requestToEditId: string;
  addEditForm: FormGroup;
  // requestStatuses = [RequestedTripStatus.Accepted, RequestedTripStatus.Pending, RequestedTripStatus.Rejected];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  tripTypes = [TripTypes.Private, TripTypes.Pooling];
  selectedTypes = [TripTypes.Private, TripTypes.Pooling];
  tripStatuses = Object.values(RequestedTripStatus);
  selectedStatuses = Object.values(RequestedTripStatus);

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
    this.requestedTripService.getAll(Constant.GET_PILOTS).subscribe(
      (res: any) => {
        this.pilots = res.items;
      }
    )
  }

  getAll(
    pageIndex: number = 0,
    pageSize: number = 10,
    statuses: RequestedTripStatus[] = this.tripStatuses,
    types: TripTypes[] = this.tripTypes
  ) {
    this.requestedTripService.getRequestedTrips(Constant.GET_REQUESTED_TRIPS, types, statuses, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
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

  selectPilot(pilotId: string) {
    this.selectedPilotId = pilotId;
  }

  openApproveModal(modal: any, item: IRequestedTrip) {
    this.selectedPilotId = '';
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
    this.requestedTripService.approveReject(Constant.REJECT_REQUESTED_TRIP, { requestedTripId: this.selectedRequest._id })
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

  approveRequest() {
    this.requestedTripService.approveRequestedTrip(Constant.APPROVE_REQUESTED_TRIP, this.selectedRequest._id, this.selectedPilotId, +this.selectedPrice)
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

  filterTypes(selectedType: string) {
    let type = Object.values(TripTypes).find(x => x == selectedType);
    this.selectedTypes = type ? [type] : [TripTypes.Private, TripTypes.Pooling];
    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedTypes);
  }

  filterStatuses(selectedStatus: string) {
    let status = Object.values(RequestedTripStatus).find(x => x == selectedStatus);
    this.selectedStatuses = status ? [status] : Object.values(RequestedTripStatus);
    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedTypes);
  }

  resetFilters(){
    this.selectedTypes = [TripTypes.Private, TripTypes.Pooling];
    this.selectedStatuses = Object.values(RequestedTripStatus);
    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedStatuses, this.selectedTypes);
  }

  openTripDetails(modal: any, trip: IRequestedTrip) {
    this.selectedTripDetails = trip;
    this.modalService.open(modal, { size: 'md' });
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

}
