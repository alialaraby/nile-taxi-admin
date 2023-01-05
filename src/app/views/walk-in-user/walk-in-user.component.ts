import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAddWalkInUserTransaction } from 'src/app/core/model/add-walk-in-transaction';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IPassengerTrip } from 'src/app/core/model/passenger-trip';
import { IStation } from 'src/app/core/model/station';
import { ITrip } from 'src/app/core/model/trip';
import { DataService } from 'src/app/core/service/data.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-walk-in-user',
  templateUrl: './walk-in-user.component.html',
  styleUrls: ['./walk-in-user.component.scss']
})
export class WalkInUserComponent implements OnInit {

  passengerTrips: IPassengerTrip[] = [];
  selectedItem: IPassengerTrip;

  availableTrips: ITrip[] = [];
  selectedTrip: ITrip;

  stations: IStation[] = [];
  selectedStation: IStation;

  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  addEditForm: FormGroup;

  constructor(
    private dataService: DataService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
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

    this.dataService.getAll(Constant.GET_STATIONS, 0, 100)
      .subscribe(
        (res: any) => {
          this.stations = res.items;
          this.selectedStation = this.stations[0];
          this.getTripsByStation();
        }
      );
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_WALK_IN_USER_TRIPS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.passengerTrips = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  getTripsByStation() {
    this.dataService.getTripsByStation(Constant.GET_TRIPS_FOR_WALK_IN_USER, { stationId: this.selectedStation._id })
      .subscribe(
        (res: any) => {
          this.availableTrips = res.items;
        }
      );
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

  openAddModal(modal, itemToEdit: IAddWalkInUserTransaction = null) {
    this.buildForm();
    this.modalService.open(modal);
  }

  openDeleteItem(modal: any, item: IPassengerTrip) {
    this.selectedItem = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm() {
    this.addEditForm = this.fb.group({
      tripId: ['', Validators.required],
      paidAmount: ['', Validators.required],
      numberOfSeats: ['', Validators.required],
      userFullName: ['', Validators.required],
      userPhone: ['', Validators.required],
    });
  }

  selectStation(stationId) {
    this.selectedStation = this.stations.find(x => x._id.toString() == stationId);
    this.getTripsByStation();
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      this.dataService.add(Constant.ADD_WALK_IN_USER_PAYMENT
        , model)
        .subscribe(
          (res: any) => {
            this._responseHandler.HandleSuccess(res, ResponseActionType.Added);
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
  }

  getModelFromForm(form: FormGroup) {
    let model = {
      // _id: this.stationToEditId ? this.stationToEditId : null,
      tripId: form.get('tripId').value,
      userFullName: form.get('userFullName').value,
      userPhone: form.get('userPhone').value,
      numberOfSeats: form.get('numberOfSeats').value,
      paidAmount: +form.get('paidAmount').value,
    };

    return model;
  }

}
