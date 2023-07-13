import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { IBoat } from 'src/app/core/model/boat';
import { Constant } from 'src/app/core/model/constant';
import { FuelType, ResponseActionType } from 'src/app/core/model/enums';
import { IPilot } from 'src/app/core/model/pilot';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-boat',
  templateUrl: './boat.component.html',
  styleUrls: ['./boat.component.scss']
})
export class BoatComponent implements OnInit {

  boats: IBoat[] = [];
  selectedBoat: IBoat;
  pilots: IPilot[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;
  isEditItem: boolean = false;
  activateBoat: boolean = false;
  boatToEditId: string;

  fuelTypes = [FuelType.Diesel, FuelType.Gasoline, FuelType.Electric];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  resError = '';

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
    this.getPilots();
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_BOATS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.boats = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  getPilots() {
    this.dataService.getAll(Constant.GET_UNASSIGNED_PILOTS)
      .subscribe(
        (res: any) => {          
          this.pilots = res.items;
        },
        (error) => {
          this._responseHandler.HandelError(error);
        }
      );
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

  buildForm(itemToEdit?: IBoat) {
    this.addEditForm = this.fb.group({
      boatName: [itemToEdit ? itemToEdit.boatName : '', Validators.required],
      serial: [itemToEdit ? itemToEdit.serial : '', Validators.required],
      model: [itemToEdit ? itemToEdit.model : '', Validators.required],
      capacity: [itemToEdit ? itemToEdit.capacity : '', Validators.required],
      assignedPilotId: [itemToEdit ? itemToEdit.assignedPilotId._id : '', Validators.required],
      hoursNeededForMaintenance: [itemToEdit ? itemToEdit.hoursNeededForMaintenance : '', Validators.required],
      fuelCapacity: [itemToEdit ? itemToEdit.fuelCapacity : '', Validators.required],
      fuelType: [itemToEdit ? itemToEdit.fuelType : '', Validators.required],
      expectedFuelConsumption: [itemToEdit ? itemToEdit.expectedFuelConsumption : ''],
    
      type: [itemToEdit ? itemToEdit.type : ''],
      modelYear: [itemToEdit ? itemToEdit.modelYear : ''],
      launchDate: [itemToEdit ? itemToEdit.launchDate : ''],
    
      length: [itemToEdit ? itemToEdit.length : ''],
      beam: [itemToEdit ? itemToEdit.beam : ''],
      license: [itemToEdit ? itemToEdit.license : ''],
      licenseRenewalDate: [itemToEdit ? itemToEdit.licenseRenewalDate : ''],
      
      // image: [itemToEdit ? itemToEdit.image : '', Validators.required],
      engineBrand: [itemToEdit ? itemToEdit.engineBrand : ''],
      engineModel: [itemToEdit ? itemToEdit.engineModel : ''],
      engineModelYear: [itemToEdit ? itemToEdit.engineModelYear : ''],
      engineSerial: [itemToEdit ? itemToEdit.engineSerial : ''],
      engineHours: [itemToEdit ? itemToEdit.engineHours : ''],
      topSpeed: [itemToEdit ? itemToEdit.topSpeed : ''],
      averageSpeed: [itemToEdit ? itemToEdit.averageSpeed : ''],
    });
  }

  openAddModal(modal, itemToEdit: IBoat = null) {
    if (itemToEdit) {
      this.isEditItem = true;
      this.boatToEditId = itemToEdit._id;
      this.pilots.push(itemToEdit.assignedPilotId);
      this.buildForm(itemToEdit);
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  openDeleteItem(modal: any, item: IBoat) {
    this.selectedBoat = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  add() {
    this.resError = '';
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.UPDATE_BOAT, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Updated);
              this.getAll();
              this.getPilots();
              this.modalService.dismissAll();
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
        this.dataService.add(Constant.ADD_BOAT, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Added);
              this.getAll();
              this.getPilots();
              this.modalService.dismissAll();
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

  getModelFromForm(form: FormGroup) {
    let model = {
      boatId: this.boatToEditId ? this.boatToEditId : null,
      boatName: form.get('boatName').value,
      serial: form.get('serial').value,
      model: form.get('model').value,
      capacity: form.get('capacity').value,
      assignedPilotId: form.get('assignedPilotId').value,
      hoursNeededForMaintenance: form.get('hoursNeededForMaintenance').value,
      fuelCapacity: form.get('fuelCapacity').value,
      fuelType: form.get('fuelType').value,
      expectedFuelConsumption: form.get('expectedFuelConsumption').value,

      type: form.get('type').value,
      modelYear: form.get('modelYear').value,
      launchDate: form.get('launchDate').value,

      length: form.get('length').value,
      beam: form.get('beam').value,
      license: form.get('license').value,
      licenseRenewalDate: form.get('licenseRenewalDate').value,

      engineBrand: form.get('engineBrand').value,
      engineModel: form.get('engineModel').value,
      engineModelYear: form.get('engineModelYear').value,
      engineSerial: form.get('engineSerial').value,
      engineHours: form.get('engineHours').value,
      topSpeed: form.get('topSpeed').value,
      averageSpeed: form.get('averageSpeed').value,
    };

    return model;
  }

  deleteItem() {
    this.dataService.delete(Constant.DELETE_BOAT, { itemId: this.selectedBoat._id })
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Deleted);
          this.getAll();
          this.getPilots();
          this.modalService.dismissAll();
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
        }
      );
  }

  openActivateItem(modal: any, item: IBoat, activate: boolean) {
    this.activateBoat = activate;
    this.selectedBoat = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  activate() {
    this.dataService.activateBoat(Constant.ACTIVATE_BOAT, { itemId: this.selectedBoat._id, activate: this.activateBoat })
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Done);
          this.getAll();
          this.getPilots();
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
