import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { IBoat } from 'src/app/core/model/boat';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IPilot } from 'src/app/core/model/pilot';
import { PilotWithBoat } from 'src/app/core/model/pilot-with-boat';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {

  pilots: IPilot[] = [];
  selectedPilot: IPilot;
  selectedBoat: IBoat;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;
  isEditItem: boolean = false;
  pilotToEditId: string;
  boatToEditId: string;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  dateOfBirthDateModel: NgbDateStruct;
  licenseIssuingDateModel: NgbDateStruct;
  licenseExpirationDateModel: NgbDateStruct;

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
    this.dataService.getAll(Constant.GET_PILOTS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.pilots = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  buildForm(itemToEdit?: IPilot) {
    if(itemToEdit) {
      let dateOfBirth = new Date(itemToEdit.dateOfBirth);
      let licenseIssuingDate = new Date(itemToEdit.licenseIssuingDate);
      let licenseExpirationDate = new Date(itemToEdit.licenseExpirationDate);
      this.dateOfBirthDateModel = { year: dateOfBirth.getFullYear(), month: dateOfBirth.getMonth() + 1, day: dateOfBirth.getDate() };
      this.licenseIssuingDateModel = { year: licenseIssuingDate.getFullYear(), month: licenseIssuingDate.getMonth() + 1, day: licenseIssuingDate.getDate() };
      this.licenseExpirationDateModel = { year: licenseExpirationDate.getFullYear(), month: licenseExpirationDate.getMonth() + 1, day: licenseExpirationDate.getDate() };
    } 
       
    this.addEditForm = this.fb.group({
      fullName: [itemToEdit ? itemToEdit.fullName : '', Validators.required],
      phone: [itemToEdit ? itemToEdit.phone : '', Validators.required],
      email: [itemToEdit ? itemToEdit.email : '', Validators.required],
      gender: [itemToEdit ? itemToEdit.gender : '', Validators.required],
      dateOfBirth: ['', Validators.required],

      codeName: [itemToEdit ? itemToEdit.codeName : '', Validators.required],
      username: [itemToEdit ? itemToEdit.username : '', Validators.required],
      licenseType: [itemToEdit ? itemToEdit.licenseType : '', Validators.required],
      licenseNumber: [itemToEdit ? itemToEdit.licenseNumber : '', Validators.required],
      licenseIssuingDate: ['', Validators.required],
      licenseExpirationDate: ['', Validators.required],
    });
  }

  openAddModal(modal, itemToEdit: IPilot = null) {
    if(itemToEdit){
      this.isEditItem = true;
      this.pilotToEditId = itemToEdit._id;
      // this.boatToEditId = itemToEdit.boat._id;
      this.buildForm(itemToEdit);
    }else{
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  openBoatDetails(modal: any, boat: IBoat) {
    this.selectedBoat = boat;
    this.modalService.open(modal, { size: 'lg' });
  }

  openDeleteItem(modal: any, item: IPilot) {
    this.selectedPilot = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if(this.isEditItem){
        this.dataService.update(Constant.UPDATE_PILOT, model)
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
      }else{
        this.dataService.add(Constant.ADD_PILOT, model)
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

  getModelFromForm(form: FormGroup){
    let model: PilotWithBoat = new PilotWithBoat();
    if(this.pilotToEditId) model._id = this.pilotToEditId;
    model.fullName = form.get('fullName').value;
    model.email = form.get('email').value;
    model.phone = form.get('phone').value;
    model.gender = form.get('gender').value;

    model.dateOfBirth = form.get('dateOfBirth').value;
    model.codeName = form.get('codeName').value;
    model.username = form.get('username').value;
    model.licenseType = form.get('licenseType').value;
    model.licenseNumber = form.get('licenseNumber').value;
    model.licenseIssuingDate = form.get('licenseIssuingDate').value;
    model.licenseExpirationDate = form.get('licenseExpirationDate').value;
    
    return model;
  }

  deleteItem() {
    this.dataService.delete(Constant.DELETE_PILOT, { itemId: this.selectedPilot._id })
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
