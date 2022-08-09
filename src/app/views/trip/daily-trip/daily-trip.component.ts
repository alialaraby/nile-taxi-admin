import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbTimepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin  } from 'rxjs';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType, TripTypes } from 'src/app/core/model/enums';
import { IPilot } from 'src/app/core/model/pilot';
import { IStation } from 'src/app/core/model/station';
import { ITrip } from 'src/app/core/model/trip';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';
import { TripService } from 'src/app/core/service/trip.service';

@Component({
  selector: 'app-daily-trip',
  templateUrl: './daily-trip.component.html',
  styleUrls: ['./daily-trip.component.scss']
})
export class DailyTripComponent implements OnInit {

  pilots: IPilot[] = [];
  stations: IStation[] = [];
  trips: ITrip[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  selectedTrip: ITrip;
  isEditItem: boolean = false;
  tripToEditId: string;

  addEditForm: FormGroup;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  pickupDateModel: NgbDateStruct;
  pickupTime: NgbTimeStruct = {hour: 1, minute: 0, second: 0};

  terminalDateModel: NgbDateStruct;
  terminalTime: NgbTimeStruct = {hour: 1, minute: 0, second: 0};

  tripTypes = [TripTypes.Daily, TripTypes.Tour];

  selectedStations: any[];

  constructor(
    private tripService: TripService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    config: NgbTimepickerConfig
  ) {
    config.spinners = false;
    this.sharedData.userData$.subscribe(
      (userData) => {
        this.sharedUserData._id = userData._id;
        this.sharedUserData.accessToken = userData.accessToken;
      }
    );
  }

  ngOnInit(): void {
    this.getAll(this.pageIndex - 1, this.pageSize);
    this.getInitialData();
  }

  getInitialData(){
    let getPilots = this.tripService.getAll(Constant.GET_PILOTS);
    let getStations = this.tripService.getAll(Constant.GET_STATIONS);
    forkJoin([getPilots, getStations]).subscribe(
      (res: any) => {
        this.pilots = res[0].items;
        this.stations = res[1].items;
      }
    )
  }

  getAll(pageIndex: number = 0, pageSize: number = 10, types: TripTypes[] = [TripTypes.Daily, TripTypes.Tour]) {
    this.tripService.getTrips(Constant.GET_TRIPS, types, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.trips = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.tripService.update(Constant.UPDATE_TRIP, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Updated);
              this.getAll();
              this.modalService.dismissAll();
            },
            (error) => {
              this.gettingData = false;
              this._responseHandler.HandelError(error);
              this.modalService.dismissAll();
            }
          );
      } else {
        this.tripService.add(Constant.ADD_TRIP, model)
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
  }

  deleteItem() {
    this.tripService.delete(Constant.DELETE_TRIP, { itemId: this.selectedTrip._id })
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Deleted);
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

  openAddModal(modal, itemToEdit: ITrip = null) {
    if(itemToEdit){
      this.isEditItem = true;
      this.tripToEditId = itemToEdit._id;
      this.buildForm(itemToEdit);
    }else{
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  buildForm(itemToEdit?: ITrip) {
    if(itemToEdit){
      let pickupDate = new Date(itemToEdit.pickupDate);
      let terminalDate = new Date(itemToEdit.terminalDate);
      this.pickupDateModel = { year: pickupDate.getFullYear(), month: pickupDate.getMonth() + 1, day: pickupDate.getDate() };
      this.pickupTime = { hour: pickupDate.getHours(), minute: pickupDate.getMinutes(), second: 0 };
      this.terminalDateModel = { year: terminalDate.getFullYear(), month: terminalDate.getMonth() + 1, day: terminalDate.getDate() };
      this.terminalTime = { hour: terminalDate.getHours(), minute: terminalDate.getMinutes(), second: 0 };
      this.selectedStations = itemToEdit.stations;
    }
    this.addEditForm = this.fb.group({
      code: [itemToEdit ? itemToEdit.code : '', Validators.required],
      type: [itemToEdit ? itemToEdit.type : '', Validators.required],
      pickupStation: [itemToEdit ? itemToEdit.pickupStation._id : '', Validators.required],
      terminalStation: [itemToEdit ? itemToEdit.terminalStation._id : '', Validators.required],
      pilot: [itemToEdit ? itemToEdit.pilot._id : '', Validators.required],
      price: [itemToEdit ? itemToEdit.price : '', Validators.required],
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      terminalDate: ['', Validators.required],
      terminalTime: ['', Validators.required],
      stations: ['', Validators.required],
    });
  }

  openDeleteItem(modal: any, item: ITrip) {
    this.selectedTrip = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  getModelFromForm(form: FormGroup) {
    let model = {
      _id: this.tripToEditId ? this.tripToEditId : null,
      code: form.get('code').value,
      type: form.get('type').value,
      pickupStation: form.get('pickupStation').value,
      terminalStation: form.get('terminalStation').value,
      pilot: form.get('pilot').value,
      price: form.get('price').value,
      stations: this.selectedStations.map((x, index) => {
        return {stationId: x._id, order: index + 1}
      }),

      pickupDateYear: this.pickupDateModel.year,
      pickupDateMonth: this.pickupDateModel.month,
      pickupDateDay: this.pickupDateModel.day,
      pickupDateHour: this.pickupTime.hour,
      pickupDateMinute: this.pickupTime.minute,

      terminalDateYear: this.terminalDateModel.year,
      terminalDateMonth: this.terminalDateModel.month,
      terminalDateDay: this.terminalDateModel.day,
      terminalDateHour: this.terminalTime.hour,
      terminalDateMinute: this.terminalTime.minute,
    };

    return model;
  }

  filterTypes(selectedType: string){
    let type = Object.values(TripTypes).find(x => x == selectedType);
    let types = type ? [type] : [TripTypes.Daily, TripTypes.Tour];

    this.getAll(this.pageIndex - 1, this.pageSize, types);
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }
}
