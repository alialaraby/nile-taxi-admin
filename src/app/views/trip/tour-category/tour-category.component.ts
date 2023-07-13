import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { ITripCategory } from 'src/app/core/model/tour-category';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-tour-category',
  templateUrl: './tour-category.component.html',
  styleUrls: ['./tour-category.component.scss']
})
export class TourCategoryComponent implements OnInit {

  categories: ITripCategory[] = [];
  selectedCategory: ITripCategory;
  isEditItem: boolean = false;
  categoryToEditId: string;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;

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
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_TOURS_CATEGORIES, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.categories = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, itemToEdit: ITripCategory = null) {
    if (itemToEdit) {
      this.isEditItem = true;
      this.categoryToEditId = itemToEdit._id;
      this.buildForm(itemToEdit);
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  openDeleteItem(modal: any, item: ITripCategory) {
    this.selectedCategory = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm(itemToEdit?: ITripCategory) {
    this.addEditForm = this.fb.group({
      name: [itemToEdit ? itemToEdit.name : '', Validators.required],
    });
  }

  add() {
    this.resError = '';
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.UPDATE_TOURS_CATEGORY, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Updated);
              this.getAll();
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
        this.dataService.add(Constant.ADD_TOURS_CATEGORY, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Added);
              this.getAll();
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
      _id: this.categoryToEditId ? this.categoryToEditId : null,
      name: form.get('name').value
    };

    return model;
  }

  deleteItem() {
    this.dataService.delete(Constant.DELETE_TOURS_CATEGORIES, { itemId: this.selectedCategory._id })
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
