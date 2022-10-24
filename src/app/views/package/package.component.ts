import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IPackage } from 'src/app/core/model/package';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {

  packages: IPackage[] = [];
  selectedPackage: IPackage;
  isEditItem: boolean = false;
  packageToEditId: string;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  activatePackage: boolean = false;
  addEditForm: FormGroup;

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
    this.dataService.getAll(Constant.GET_PACKAGES, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.packages = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, itemToEdit: IPackage = null) {
    if (itemToEdit) {
      this.isEditItem = true;
      this.packageToEditId = itemToEdit._id;
      this.buildForm(itemToEdit);
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  openDeleteItem(modal: any, item: IPackage) {
    this.selectedPackage = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm(itemToEdit?: IPackage) {
    this.addEditForm = this.fb.group({
      name: [itemToEdit ? itemToEdit.name : '', Validators.required],
      noOfRides: [itemToEdit ? itemToEdit.noOfRides : '', Validators.required],
      price: [itemToEdit ? itemToEdit.price : '', Validators.required],
      expiresAfter: [itemToEdit ? itemToEdit.expiresAfter : '', Validators.required],
    });
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.UPDATE_PACKAGE, model)
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
        this.dataService.add(Constant.ADD_PACKAGE, model)
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
      _id: this.packageToEditId ? this.packageToEditId : null,
      name: form.get('name').value,
      noOfRides: form.get('noOfRides').value,
      price: form.get('price').value,
      expiresAfter: form.get('expiresAfter').value,
    };

    return model;
  }

  deleteItem() {
    this.dataService.delete(Constant.DELETE_PACKAGE, { itemId: this.selectedPackage._id })
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

  openActivateItem(modal: any, item: IPackage, activate: boolean) {
    this.activatePackage = activate;
    this.selectedPackage = item;
    this.modalService.open(modal, { size: 'md' });
  }

  activate() {
    this.dataService.activateBoat(Constant.ACTIVATE_PACKAGE, { itemId: this.selectedPackage._id, activate: this.activatePackage })
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

}
