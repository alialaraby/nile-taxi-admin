import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType, UserType } from 'src/app/core/model/enums';
import { IPassenger } from 'src/app/core/model/passenger';
import { IPassengerTrip } from 'src/app/core/model/passenger-trip';
import { IPaymentTransaction } from 'src/app/core/model/payment-transaction';
import { DataService } from 'src/app/core/service/data.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.scss']
})
export class PassengerComponent implements OnInit {

  passengers: IPassenger[] = [];
  selectedPassenger: IPassenger;
  selectedPassengerTrips: IPassengerTrip[];
  selectedPassengerPayments: IPaymentTransaction[];
  selectedPassengerToAddBalance: IPassenger;

  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  userTypes = [UserType.Passenger, UserType.FamilyAdmin, UserType.Dependent, UserType.Student];
  // selectedType: string;
  selectedTypes: UserType[];
  defaultType: boolean = true;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  balanceControl = new FormControl('', Validators.required);

  constructor(
    private dataService: DataService,
    private passengerService: PassengerService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
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

  getAll(pageIndex: number = 0, pageSize: number = 10, types: UserType[] = this.userTypes) {
    this.passengerService.getPassengers(Constant.GET_PASSENGERS, types, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.passengers = res.items;
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
    let type = Object.values(UserType).find(x => x == selectedType);
    this.selectedTypes = type ? [type] : this.userTypes;
    // this.selectedType = selectedType;

    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedTypes);
  }

  resetFilters() {
    this.defaultType = true;
    this.getAll(this.pageIndex - 1, this.pageSize);
  }

  openTrips(modal: any, passenger: IPassenger) {
    this.passengerService.getPassengerTrips(Constant.ADMIN_GET_PASSENGER_TRIPS, passenger._id, passenger.type)
      .subscribe(
        (res: any) => {
          this.selectedPassengerTrips = res.items;
          this.modalService.open(modal, { size: 'md' });
        },
        (error) => {
          this._responseHandler.HandelError(error);
        }
      );
  }

  openPayments(modal: any, passenger: IPassenger) {
    this.passengerService.getPassengerPayments(Constant.ADMIN_GET_PASSENGER_PAYMENTS, passenger._id)
      .subscribe(
        (res: any) => {
          this.selectedPassengerPayments = res.items;
          this.modalService.open(modal, { size: 'md' });
        },
        (error) => {
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddBalance(modal: any, passenger: IPassenger) {
    this.balanceControl = new FormControl('', Validators.required);
  
    this.selectedPassengerToAddBalance = passenger;
    this.modalService.open(modal, { size: 'md' });
  }

  addBalance(){
    this.passengerService.add(Constant.ADMIN_ADD_PASSENGER_BALANCE, { passengerId: this.selectedPassengerToAddBalance._id, balance: this.balanceControl.value })
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Added);
          this.getAll();
          this.modalService.dismissAll();
        },
        (error) => {
          this._responseHandler.HandelError(error);
        }
      );
  }

}
