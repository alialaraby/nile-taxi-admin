import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbTimepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IStation } from 'src/app/core/model/station';
import { ITripRoute } from 'src/app/core/model/trip-route';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-trip-route',
  templateUrl: './trip-route.component.html',
  styleUrls: ['./trip-route.component.scss']
})
export class TripRouteComponent implements OnInit {

  tripRoutes: ITripRoute[] = [];
  selectedTripRoute: ITripRoute;
  selectedTripRouteDetails: ITripRoute;
  isEditItem: boolean = false;
  tripRouteToEditId: string;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  
  addEditForm: FormGroup;
  stations: IStation[] = [];
  stops: FormArray = new FormArray([], Validators.required);
  stopsHeadings: FormArray = new FormArray([], Validators.required);
  
  stopsWaitingTimes: FormArray = new FormArray([], Validators.required);
  stopsTimesTilNextStop: FormArray = new FormArray([], Validators.required);
  
  // stopsArrivalTimes: FormArray = new FormArray([], Validators.required);
  // stopsDepartureTimes: FormArray = new FormArray([], Validators.required);
  // timesBetweenStations: FormArray = new FormArray([], Validators.required);

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  pickupTime: NgbTimeStruct = { hour: 1, minute: 0, second: 0 };
  terminalTime: NgbTimeStruct = { hour: 1, minute: 0, second: 0 };
  selectedStops: any[]; // stop with order and arrival time

  shortImageName: string = 'Enter Image';
  fileToUpload: File[] = null;

  resError = '';
  constructor(
    private dataService: DataService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    config: NgbTimepickerConfig
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
		config.spinners = false;
  }

  ngOnInit(): void {
    this.getAll();
    this.dataService.getAll(Constant.GET_STATIONS).subscribe(
      (res: any) => {
        this.stations = res.items;
      }
    );
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_TRIP_ROUTES, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.tripRoutes = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, itemToEdit: ITripRoute = null) {
    if (itemToEdit) {
      this.isEditItem = true;
      this.tripRouteToEditId = itemToEdit._id;
      this.buildForm(itemToEdit);
      for (let i = 0; i < itemToEdit.stops.length; i++) {
        this.addFormField(
          itemToEdit.stops[i].stop._id, 
          itemToEdit.stops[i].waitingTime, 
          itemToEdit.stops[i].timeTilNextStop, 
          itemToEdit.stops[i].stopHeading._id, 

          // {hour: +itemToEdit.stops[i].arrivalTime.split(':')[0], minute: +itemToEdit.stops[i].arrivalTime.split(':')[1], second: 0},
          // {hour: +itemToEdit.stops[i].departureTime.split(':')[0], minute: +itemToEdit.stops[i].departureTime.split(':')[1], second: 0},
          // itemToEdit.stops[i].timeBetweenStations
        )
      }
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal, {size: 'lg'});
  }

  openDeleteItem(modal: any, item: ITripRoute) {
    this.selectedTripRoute = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm(itemToEdit?: ITripRoute) {
    if (itemToEdit) {
      // this.pickupTime = { hour: +itemToEdit.pickupTime.split(':')[0], minute: +itemToEdit.pickupTime.split(':')[1], second: 0 };
      // this.terminalTime = { hour: +itemToEdit.terminalTime.split(':')[0], minute: +itemToEdit.terminalTime.split(':')[1], second: 0 };
      this.selectedStops = itemToEdit.stops;
    }
    this.addEditForm = this.fb.group({
      name: [itemToEdit ? itemToEdit.name : '', Validators.required],
      ID: [itemToEdit ? itemToEdit.ID : '', Validators.required],
      image: [itemToEdit ? itemToEdit.image : ''],
      description: [itemToEdit ? itemToEdit.description : ''],
      // tourRoute: [itemToEdit ? itemToEdit?.tourRoute : false],
      stops: new FormArray([], Validators.required),
      stopsHeadings: new FormArray([], Validators.required),
      stopsWaitingTimes: new FormArray([], Validators.required),
      stopsTimesTilNextStop: new FormArray([], Validators.required),

      // stopsArrivalTimes: new FormArray([], Validators.required),
      // stopsDepartureTimes: new FormArray([], Validators.required),
      // timesBetweenStations: new FormArray([], Validators.required),
    });

    this.stops = this.addEditForm.get('stops') as FormArray;
    this.stopsHeadings = this.addEditForm.get('stopsHeadings') as FormArray;
    
    this.stopsWaitingTimes = this.addEditForm.get('stopsWaitingTimes') as FormArray;
    this.stopsTimesTilNextStop = this.addEditForm.get('stopsTimesTilNextStop') as FormArray;
    
    // this.stopsArrivalTimes = this.addEditForm.get('stopsArrivalTimes') as FormArray;
    // this.stopsDepartureTimes = this.addEditForm.get('stopsDepartureTimes') as FormArray;
    // this.timesBetweenStations = this.addEditForm.get('timesBetweenStations') as FormArray;
  }

  getModelFromForm(form: FormGroup) {
    let formData = new FormData();
    formData.append('_id', this.tripRouteToEditId ? this.tripRouteToEditId : null);
    formData.append('name', form.get('name').value);
    formData.append('ID', form.get('ID').value);
    formData.append('description', form.get('description').value);
    // formData.append('tourRoute', form.get('tourRoute').value);

    if(this.fileToUpload){
      formData.append('routeImage', this.fileToUpload[0], this.fileToUpload[0].name);
    }
    let stops = this.extractData(form.get('stops').value);
    let stopsHeadings = this.extractData(form.get('stopsHeadings').value);
    let stopsWaitingTimes = this.extractData(form.get('stopsWaitingTimes').value) as any;
    let stopsTimesTilNextStop = this.extractData(form.get('stopsTimesTilNextStop').value) as any;


    // let stopsArrivalTimes = this.extractData(form.get('stopsArrivalTimes').value) as any;
    // let stopsDepartureTimes = this.extractData(form.get('stopsDepartureTimes').value) as any;
    // let timesBetweenStations = this.extractData(form.get('timesBetweenStations').value);
    let stopsData = [];
    // let nowDate = new Date();
    
    for (let i = 0; i < stops.length; i++) {
      stopsData.push({
        stop: stops[i],
        order: i+1,
        stopHeading: stopsHeadings[i],
        waitingTime: stopsWaitingTimes[i],
        timeTilNextStop: stopsTimesTilNextStop[i]
      })
    }

    stopsData.push({
      stop: stopsHeadings[stops.length - 1],
      order: stops.length,
      stopHeading: stopsHeadings[stops.length - 1],
      waitingTime: 0,
      timeTilNextStop: 0
    })
    formData.append('stops', JSON.stringify(stopsData));

    return formData;
  }

  extractData(array: string[]) {
    let values: string[] = [];
    array.forEach(element => {
      values.push(element);
    });
    return values;
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

  addFormField(con1 = '', con2: any = '', con3: any = '', con4: any = '', con5 = '') {
    const control1 = new FormControl(con1, Validators.required);
    const control2 = new FormControl(con2, Validators.required);
    const control3 = new FormControl(con3, Validators.required);
    const control4 = new FormControl(con4, Validators.required);
    // const control5 = new FormControl(con5, Validators.required);
    this.stops.push(control1);
    this.stopsWaitingTimes.push(control2);
    this.stopsTimesTilNextStop.push(control3);
    this.stopsHeadings.push(control4);


    // this.stopsArrivalTimes.push(control2);
    // this.stopsDepartureTimes.push(control3);
    // this.timesBetweenStations.push(control5);
  }

  removeFormField(index: number) {
    this.stops.removeAt(index);
    this.stopsWaitingTimes.removeAt(index);
    this.stopsTimesTilNextStop.removeAt(index);
    this.stopsHeadings.removeAt(index);
    
    // this.stopsArrivalTimes.removeAt(index);
    // this.stopsDepartureTimes.removeAt(index);
    // this.timesBetweenStations.removeAt(index);
  }

  OnChangeFile(files: File[]) {
    this.fileToUpload = files;
    this.shortImageName = 'Image added';
  }

  add() {
    this.resError = '';
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.UPDATE_TRIP_ROUTE, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Updated);
              this.getAll();
              this.modalService.dismissAll();
              this.fileToUpload = null;
              this.shortImageName = 'Enter Image';
              this.stops = new FormArray([], Validators.required);
              this.stopsWaitingTimes = new FormArray([], Validators.required);
              this.stopsTimesTilNextStop = new FormArray([], Validators.required);
              this.stopsHeadings = new FormArray([], Validators.required);

              // this.stopsArrivalTimes = new FormArray([], Validators.required);
              // this.stopsDepartureTimes = new FormArray([], Validators.required);
              // this.timesBetweenStations = new FormArray([], Validators.required);
            },
            (error) => {
              if(error.OriginalError.status && (error.OriginalError.status == 409 || error.OriginalError.status == 400)){
                this.resError = error?.OriginalError?.error?.alreadyExistProps;
              }
              this.gettingData = false;
              this._responseHandler.HandelError(error);
              // this.modalService.dismissAll();
            }
          );
      } else {
        this.dataService.add(Constant.ADD_TRIP_ROUTE, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Added);
              this.getAll();
              this.modalService.dismissAll();
              this.fileToUpload = null;
              this.shortImageName = 'Enter Image';
              this.stops = new FormArray([], Validators.required);
              this.stopsWaitingTimes = new FormArray([], Validators.required);
              this.stopsTimesTilNextStop = new FormArray([], Validators.required);
              this.stopsHeadings = new FormArray([], Validators.required);
              
              // this.stopsArrivalTimes = new FormArray([], Validators.required);
              // this.stopsDepartureTimes = new FormArray([], Validators.required);
              // this.timesBetweenStations = new FormArray([], Validators.required);
            },
            (error) => {
              if(error.OriginalError.status && (error.OriginalError.status == 409 || error.OriginalError.status == 400)){
                this.resError = error?.OriginalError?.error?.alreadyExistProps;
              }
              this.gettingData = false;
              this._responseHandler.HandelError(error);
              // this.modalService.dismissAll();
            }
          );
      }
    }
  }

  openTripDetails(modal: any, tripRoute: ITripRoute) {
    this.selectedTripRouteDetails = tripRoute;
    this.modalService.open(modal, { size: 'lg' });
  }

  formateTime(time: string){
    let timeParts = time.split(':');
    return +timeParts[0] > 12 ? `${this.formateTimePart(+timeParts[0] - 12)}:${this.formateTimePart(+timeParts[1])} PM` : 
      `${this.formateTimePart(+timeParts[0])}:${this.formateTimePart(+timeParts[1])} AM`;
  }

  formateTimePart(timePart: number){
    return timePart < 10 ? `0${timePart}` : timePart
  }

  deleteItem() {
    this.dataService.delete(Constant.DELETE_TRIP_ROUTE, { itemId: this.selectedTripRoute._id })
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

}
