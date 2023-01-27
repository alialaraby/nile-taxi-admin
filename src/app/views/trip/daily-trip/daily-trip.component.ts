import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbTimepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';
import { Admin } from 'src/app/core/model/admin';
import { IBoat } from 'src/app/core/model/boat';
import { Constant } from 'src/app/core/model/constant';
import { Days, ResponseActionType, TripTypes } from 'src/app/core/model/enums';
import { IPilot } from 'src/app/core/model/pilot';
import { IStation } from 'src/app/core/model/station';
import { ITripCategory } from 'src/app/core/model/tour-category';
import { ITrip } from 'src/app/core/model/trip';
import { IRouteStop, ITripRoute } from 'src/app/core/model/trip-route';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';
import { TripService } from 'src/app/core/service/trip.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-daily-trip',
  templateUrl: './daily-trip.component.html',
  styleUrls: ['./daily-trip.component.scss']
})
export class DailyTripComponent implements OnInit {

  tripRoutes: ITripRoute[] = [];
  tripRoutesToView: ITripRoute[] = [];

  categories: ITripCategory[] = [];
  // pilots: IPilot[] = [];
  boats: IBoat[] = [];
  stations: IStation[] = [];
  trips: ITrip[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  selectedTrip: ITrip;
  selectedTripDetails: ITrip;
  isEditItem: boolean = false;
  tripToEditId: string;
  tripToEditParentId: string;

  addEditForm: FormGroup;
  stations2: FormArray = new FormArray([], Validators.required);

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  pickupDateModel: NgbDateStruct;
  pickupTime: NgbTimeStruct = { hour: 13, minute: 0, second: 0 };

  terminalDateModel: NgbDateStruct;
  terminalTime: NgbTimeStruct = { hour: 1, minute: 0, second: 0 };

  tripTypes = [TripTypes.Daily, TripTypes.Tour];
  selectedType: string;
  selectedTypes: TripTypes[];
  selectedCategory: string;

  selectedStations: any[];
  shortImageName: string = 'Enter Image(s)';
  fileToUpload: File[] = null;

  days = [
    { name: 'Saturday', value: Days.Saturday, selected: false}, 
    { name: 'Sunday', value: Days.Sunday, selected: false}, 
    { name: 'Monday', value: Days.Monday, selected: false}, 
    { name: 'Tuesday', value: Days.Tuesday, selected: false}, 
    { name: 'Wednesday', value: Days.Wednesday, selected: false}, 
    { name: 'Thursday', value: Days.Thursday, selected: false}, 
    { name: 'Friday', value: Days.Friday, selected: false}, 
  ];
  selectedDays: number[] = [];

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
        this.sharedUserData.role = userData.role;
        this.sharedUserData.isSuperAdmin = userData.isSuperAdmin;
        this.sharedUserData.isAdmin = userData.isAdmin;
        this.sharedUserData.isCorporateAdmin = userData.isCorporateAdmin;
        this.sharedUserData.isAnalystAdmin = userData.isAnalystAdmin;
      }
    );
  }

  ngOnInit(): void {
    this.getAll(this.pageIndex - 1, this.pageSize);
    this.getInitialData();

    this.tripService.getAll(Constant.GET_TRIP_ROUTES)
      .subscribe(
        (res: any) => {
          this.tripRoutes = res.items;
          this.tripRoutesToView = res.items;
        }
      );
  }

  selectDay(day: any, selected: boolean){
    if(selected){
      this.selectedDays.push(day.value as number);
    }else{
      this.selectedDays.splice(this.selectedDays.findIndex(x => x == day.value), 1);
    }
    console.log('days: ', this.selectedDays);
  }

  getInitialData() {
    let getCategories = this.tripService.getAll(Constant.GET_TOURS_CATEGORIES);
    // let getPilots = this.tripService.getAll(Constant.GET_PILOTS);
    let getBoats = this.tripService.getAll(Constant.GET_BOATS);
    let getStations = this.tripService.getAll(Constant.GET_STATIONS);
    forkJoin([getBoats, getStations, getCategories]).subscribe(
      (res: any) => {
        this.boats = res[0].items;
        this.stations = res[1].items;
        this.categories = res[2].items;
      }
    )
  }

  getAll(pageIndex: number = 0, pageSize: number = 10, types: TripTypes[] = [TripTypes.Daily, TripTypes.Tour], categoryId?: string) {
    this.tripService.getTrips(Constant.GET_TRIPS, types, pageIndex, pageSize, categoryId)
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
              this.fileToUpload = null;
              this.shortImageName = 'Enter Image(s)';
              // this.stations2 = new FormArray([], Validators.required);
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
              this.fileToUpload = null;
              this.shortImageName = 'Enter Image(s)';
              // this.stations2 = new FormArray([], Validators.required);
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
    this.tripService.delete(Constant.DELETE_TRIP, { itemId: this.selectedTrip.parentTripId })
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
    if (itemToEdit) {
      this.isEditItem = true;
      this.tripToEditId = itemToEdit._id;
      this.tripToEditParentId = itemToEdit.parentTripId;
      this.buildForm(itemToEdit);

      // for (let i = 0; i < itemToEdit.stations.length; i++) {
      //   this.addFormField(itemToEdit.stations[i]._id)
      // }
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal, {size: 'lg'});
  }

  buildForm(itemToEdit?: ITrip) {
    this.days = [
      { name: 'Saturday', value: Days.Saturday, selected: false}, 
      { name: 'Sunday', value: Days.Sunday, selected: false}, 
      { name: 'Monday', value: Days.Monday, selected: false}, 
      { name: 'Tuesday', value: Days.Tuesday, selected: false}, 
      { name: 'Wednesday', value: Days.Wednesday, selected: false}, 
      { name: 'Thursday', value: Days.Thursday, selected: false}, 
      { name: 'Friday', value: Days.Friday, selected: false}, 
    ];
    this.selectedDays = [];
    this.pickupTime = { hour: 13, minute: 0, second: 0 };


    if (itemToEdit) {
      let pickupDate = new Date(itemToEdit.pickupDate);
      let terminalDate = new Date(itemToEdit.terminalDate);
      this.pickupDateModel = { year: pickupDate.getFullYear(), month: pickupDate.getMonth() + 1, day: pickupDate.getDate() };
      this.pickupTime = { hour: pickupDate.getHours(), minute: pickupDate.getMinutes(), second: 0 };
      this.terminalDateModel = { year: terminalDate.getFullYear(), month: terminalDate.getMonth() + 1, day: terminalDate.getDate() };
      this.terminalTime = { hour: terminalDate.getHours(), minute: terminalDate.getMinutes(), second: 0 };
      this.selectedStations = itemToEdit.stations;
      this.selectedDays = itemToEdit.parentTrip.days.sort();
      for (let i = 0; i < itemToEdit.parentTrip.days.length; i++) {
        let itemIndex = this.days.findIndex(x => x.value == itemToEdit.parentTrip.days[i]);
        if(itemIndex != -1){
          this.days[itemIndex].selected = true;
        }
      }
    }
    this.addEditForm = this.fb.group({
      code: [itemToEdit ? itemToEdit.code : '', Validators.required],
      type: [itemToEdit ? itemToEdit.type : '', Validators.required],
      // pilot: [itemToEdit ? itemToEdit.pilot._id : '', Validators.required],
      boat: [itemToEdit ? itemToEdit.boat._id : '', Validators.required],
      price: [itemToEdit ? itemToEdit.price : '0'],
      // pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      // terminalDate: ['', Validators.required],
      // terminalTime: ['', Validators.required],
      // stations2: new FormArray([], Validators.required),
      description: [itemToEdit ? itemToEdit.description : ''],
      tourImage: [itemToEdit ? itemToEdit.tourImage : ''],
      tripCategory: [itemToEdit ? itemToEdit?.category?._id : ''],
      // isRepeatedDaily: [itemToEdit ? itemToEdit?.isRepeatedDaily : true],
      route: [itemToEdit ? itemToEdit?.route?._id : '', Validators.required],
    });

    // this.stations2 = this.addEditForm.get('stations2') as FormArray;
  }

  openDeleteItem(modal: any, item: ITrip) {
    this.selectedTrip = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  getModelFromForm(form: FormGroup) {
    let formData = new FormData();
    formData.append('_id', this.tripToEditId ? this.tripToEditId : null);
    formData.append('parentTripId', this.tripToEditParentId ? this.tripToEditParentId : null);
    formData.append('code', form.get('code').value);
    formData.append('type', form.get('type').value);
    formData.append('boatId', form.get('boat').value);
    formData.append('price', form.get('price').value);
    formData.append('description', form.get('description').value);
    formData.append('route', form.get('route').value);
    formData.append('days', JSON.stringify(this.selectedDays.sort()));

    let selectedRoute = this.tripRoutesToView.find(x => x._id == form.get('route').value);
    let nowDate = new Date();

    //unfortunately it's done this way due to many changes, so just to save time, this was the easiest way !! 
    formData.append('pickupDateYear', nowDate.getFullYear().toString());
    formData.append('pickupDateMonth', nowDate.getMonth().toString());
    formData.append('pickupDateDay', nowDate.getDate().toString());
    formData.append('pickupDateHour', this.pickupTime.hour.toString());
    formData.append('pickupDateMinute', this.pickupTime.minute.toString());
    // formData.append('pickupDateHour', selectedRoute.stops[0].arrivalTime.split(':')[0].toString());
    // formData.append('pickupDateMinute', selectedRoute.stops[0].arrivalTime.split(':')[1].toString());

    formData.append('terminalDateYear', nowDate.getFullYear().toString());
    formData.append('terminalDateMonth', nowDate.getMonth().toString());
    formData.append('terminalDateDay', nowDate.getDate().toString());
    let tripDuration = 0;
    selectedRoute.stops.forEach(element => {
      tripDuration += element.waitingTime + element.waitingTime
    });
    formData.append('terminalDateHour', (this.pickupTime.hour + this.getHoursAndMinutes(tripDuration).hours).toString());
    formData.append('terminalDateMinute', (this.pickupTime.minute + this.getHoursAndMinutes(tripDuration).minutes).toString());

    formData.append('tripCategory', (form.get('type').value == TripTypes.Tour) ? form.get('tripCategory').value : null);
    // formData.append('isRepeatedDaily', form.get('isRepeatedDaily').value);

    if (this.fileToUpload) {
      for (let i = 0; i < this.fileToUpload.length; i++) {
        formData.append('tourImage', this.fileToUpload[i], this.fileToUpload[i].name);
      }
    }
    
    let stations2: IRouteStop[] = this.extractStationsData(selectedRoute.stops);
    let result = [];
    for (let i = 0; i < stations2.length; i++) {
      let sta: IRouteStop = stations2[i];
      let arrivalH = 0, arrivalM = 0, departureH = 0, departureM = 0;
      if(i == 0){
        let depMinutes = this.pickupTime.minute + sta.waitingTime;
        
        arrivalH = this.pickupTime.hour;
        arrivalM = this.pickupTime.minute;
        departureH = this.pickupTime.hour + this.getHoursAndMinutes(depMinutes).hours;
        departureM = this.getHoursAndMinutes(depMinutes).minutes;
      }else{
        let arrivingToCurrentStation = 0;
        let arrivingToCurrentStationPlusWaiting = 0;

        let slice = stations2.slice(0, i);
        slice.forEach(element => {
          arrivingToCurrentStation += element.waitingTime + element.timeTilNextStop;
        });
        arrivingToCurrentStationPlusWaiting = arrivingToCurrentStation + stations2[i].waitingTime;

        arrivalH = this.getHoursAndMinutes((this.pickupTime.hour * 60) + this.pickupTime.minute + arrivingToCurrentStation).hours;
        arrivalM = this.getHoursAndMinutes((this.pickupTime.hour * 60) + this.pickupTime.minute + arrivingToCurrentStation).minutes;
        
        departureH = this.getHoursAndMinutes((this.pickupTime.hour * 60) + this.pickupTime.minute + arrivingToCurrentStationPlusWaiting).hours;
        departureM = this.getHoursAndMinutes((this.pickupTime.hour * 60) + this.pickupTime.minute + arrivingToCurrentStationPlusWaiting).minutes;
      }
      result.push({
        stationId: sta.stop._id, 
        order: i + 1,
        arrivalTime: {hour: arrivalH.toString(), minute: arrivalM.toString()},
        departureTime: {hour: departureH.toString(), minute: departureM.toString()},
        stopHeadingId: sta.stopHeading._id,
        timeBetweenStations: sta.timeTilNextStop
      });      
    }
    console.log('result', result);
    formData.append('stations', JSON.stringify(result));
    
    // formData.append('stations', JSON.stringify(
    //   stations2.map((x, index) => { 
    //     return { 
    //       stationId: x.stop._id, 
    //       order: index + 1,
    //       arrivalTime: {hour: this.pickupTime.hour + x. , minute: x.arrivalTime.split(':')[1].toString()},
    //       departureTime: {hour: x.departureTime.split(':')[0].toString(), minute: x.departureTime.split(':')[1].toString()},
    //       stopHeadingId: x.stopHeading._id,
    //       timeBetweenStations: x.timeBetweenStations
    //     } 
    //   })
    // ));

    formData.append('pickupStation', stations2[0].stop._id);
    formData.append('terminalStation', stations2[stations2.length - 1].stop._id);

    return formData;
  }

  filterTypes(selectedType: string) {
    let type = Object.values(TripTypes).find(x => x == selectedType);
    this.selectedTypes = type ? [type] : [TripTypes.Daily, TripTypes.Tour];
    this.selectedType = selectedType;

    this.getAll(this.pageIndex - 1, this.pageSize, this.selectedTypes);
  }

  filterCategories(categoryId: string) {
    let type = Object.values(TripTypes).find(x => x == this.selectedType);
    this.tripTypes = type ? [type] : [TripTypes.Daily, TripTypes.Tour];
    this.selectedCategory = categoryId;

    this.getAll(this.pageIndex - 1, this.pageSize, this.tripTypes, categoryId);
  }

  resetFilters() {
    this.selectedCategory = null;
    this.tripTypes = [TripTypes.Daily, TripTypes.Tour];
    this.getAll(this.pageIndex - 1, this.pageSize);
  }

  OnChangeFile(files: File[]) {
    this.fileToUpload = files;
    // this.addEditForm.get('tourImage').setValue(environment.baseUrl + this.fileToUpload.name)
    this.shortImageName = 'Image(s) added';
  }

  openTripDetails(modal: any, trip: ITrip) {
    this.selectedTripDetails = trip;
    this.modalService.open(modal, { size: 'md' });
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

  // addFormField(con1 = '') {
  //   const control1 = new FormControl(con1, Validators.required);
  //   this.stations2.push(control1);
  // }
  // removeFormField(index: number) {
  //   this.stations2.removeAt(index);
  // }

  extractStationsData(stations: any[]) {
    let values: any[] = [];
    stations.forEach(element => {
      values.push(element);
    });
    return values;
  }

  // chooseType(value){
  //   if(value == TripTypes.Daily)
  //     this.tripRoutesToView = this.tripRoutes.filter(x => !x.tourRoute);
  //   else if(value == TripTypes.Tour)
  //     this.tripRoutesToView = this.tripRoutes.filter(x => x.tourRoute);
  //   else 
  //     this.tripRoutesToView = this.tripRoutes;
  // }

  getHoursAndMinutes(totalMinutes: number){
    let hours = 0, minutes = 0;
    hours = Math.floor(totalMinutes / 60);
    minutes = totalMinutes % 60;

    return { hours: hours, minutes: minutes }
  }

  formatTripCode(code: string){
    return code.split('#days#')[0];
  }

  formatTripDay(day: number){
    return Days[day];
  }

}
