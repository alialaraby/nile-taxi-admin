import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType, StationZones } from 'src/app/core/model/enums';
import { IStation } from 'src/app/core/model/station';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {

  stations: IStation[] = [];
  selectedStation: IStation;
  isEditItem: boolean = false;
  stationToEditId: string;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;

  stationZones: StationZones[] = Object.values(StationZones);

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

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
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_STATIONS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.stations = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, itemToEdit: IStation = null) {
    if (itemToEdit) {
      this.isEditItem = true;
      this.stationToEditId = itemToEdit._id;
      this.buildForm(itemToEdit);
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  openDeleteItem(modal: any, item: IStation) {
    this.selectedStation = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm(itemToEdit?: IStation) {
    this.addEditForm = this.fb.group({
      name: [itemToEdit ? itemToEdit.name : '', Validators.required],
      stationNumber: [itemToEdit ? itemToEdit.stationNumber : '', Validators.required],
      zoneId: [itemToEdit ? itemToEdit.zoneId : '', Validators.required],
      longitude: [itemToEdit ? itemToEdit.location.coordinates[0] : '', Validators.required],
      latitude: [itemToEdit ? itemToEdit.location.coordinates[1] : '', Validators.required],
    });
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.UPDATE_STATION, model)
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
        this.dataService.add(Constant.ADD_STATION, model)
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

  getModelFromForm(form: FormGroup) {
    let model = {
      _id: this.stationToEditId ? this.stationToEditId : null,
      name: form.get('name').value,
      stationNumber: form.get('stationNumber').value,
      zoneId: form.get('zoneId').value,
      longitude: +form.get('longitude').value,
      latitude: +form.get('latitude').value,
    };

    return model;
  }

  deleteItem() {
    this.dataService.delete(Constant.DELETE_STATION, { itemId: this.selectedStation._id })
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

  pageChange(pageIndex: number){
    this.getAll(pageIndex - 1);
  }

}
