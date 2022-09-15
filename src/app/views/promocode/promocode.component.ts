import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { PromocodeType, ResponseActionType } from 'src/app/core/model/enums';
import { IPromocode } from 'src/app/core/model/promocode';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {

  promocodes: IPromocode[] = [];
  selectedPromocode: IPromocode;
  isEditItem: boolean = false;
  promocodeToEditId: string;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  codeTypes = [PromocodeType.PerUser, PromocodeType.PerUserTimely];
  selectedType: string;

  validFromDateModel: NgbDateStruct;
  validToDateModel: NgbDateStruct;


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
      }
    );
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_PROMOCODES, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.promocodes = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, itemToEdit: IPromocode = null) {
    if (itemToEdit) {
      this.isEditItem = true;
      this.promocodeToEditId = itemToEdit._id;
      this.buildForm(itemToEdit);
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  openDeleteItem(modal: any, item: IPromocode) {
    this.selectedPromocode = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm(itemToEdit?: IPromocode) {
    if (itemToEdit) {
      let validFromDate = new Date(itemToEdit.validFrom);
      let validToDate = new Date(itemToEdit.validTo);
      this.validFromDateModel = { year: validFromDate.getFullYear(), month: validFromDate.getMonth() + 1, day: validFromDate.getDate() };
      this.validToDateModel = { year: validToDate.getFullYear(), month: validToDate.getMonth() + 1, day: validToDate.getDate() };
    }
    this.addEditForm = this.fb.group({
      code: [itemToEdit ? itemToEdit.code : '', Validators.required],
      noOfUsers: [itemToEdit ? itemToEdit.noOfUsers : '', Validators.required],
      noOfRidesPerUser: [itemToEdit ? itemToEdit.noOfRidesPerUser : ''],
      discountPercentage: [itemToEdit ? itemToEdit.discountPercentage : '', Validators.required],
      type: [itemToEdit ? itemToEdit.type : '', Validators.required],
      validFrom: [''],
      validTo: [''],
    });
  }

  getModelFromForm(form: FormGroup) {
    let withDate = form.get('type').value == PromocodeType.PerUserTimely;
    let model;
    if(withDate){
      model = {
        _id: this.promocodeToEditId ? this.promocodeToEditId : null,
        code: form.get('code').value,
        noOfUsers: form.get('noOfUsers').value,
        noOfRidesPerUser: form.get('noOfRidesPerUser').value,
        discountPercentage: form.get('discountPercentage').value,
        type: form.get('type').value,
  
        validFromDateYear: this.validFromDateModel.year,
        validFromDateMonth: this.validFromDateModel.month,
        validFromDateDay: this.validFromDateModel.day,
  
        validToDateYear: this.validToDateModel.year,
        validToDateMonth: this.validToDateModel.month,
        validToDateDay: this.validToDateModel.day,
      };
    }else{
      model = {
        _id: this.promocodeToEditId ? this.promocodeToEditId : null,
        code: form.get('code').value,
        noOfUsers: form.get('noOfUsers').value,
        noOfRidesPerUser: form.get('noOfRidesPerUser').value,
        discountPercentage: form.get('discountPercentage').value,
        type: form.get('type').value
      };
    }

    return model;
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.UPDATE_PROMOCODE, model)
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
        this.dataService.add(Constant.ADD_PROMOCODE, model)
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
    this.dataService.delete(Constant.DELETE_PROMOCODE, { itemId: this.selectedPromocode._id })
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

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

}
