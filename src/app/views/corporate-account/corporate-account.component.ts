import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ICorporateAccount } from 'src/app/core/model/corporate-account';
import { ResponseActionType } from 'src/app/core/model/enums';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-corporate-account',
  templateUrl: './corporate-account.component.html',
  styleUrls: ['./corporate-account.component.scss']
})
export class CorporateAccountComponent implements OnInit {

  accounts: ICorporateAccount[] = [];
  selectedAccount: ICorporateAccount;
  isEditItem: boolean = false;
  accountToEditId: string;

  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  addEditForm: FormGroup;
  shortImageName: string = 'Enter Image';
  fileToUpload: File = null;

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
    private _router: Router
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
    this.getAll(this.pageIndex - 1, this.pageSize);
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_CORPORATES, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.accounts = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, itemToEdit: ICorporateAccount = null) {
    if (itemToEdit) {
      this.isEditItem = true;
      this.accountToEditId = itemToEdit._id;
      this.buildForm(itemToEdit);
    } else {
      this.isEditItem = false;
      this.buildForm();
    }
    this.modalService.open(modal);
  }

  openDeleteItem(modal: any, item: ICorporateAccount) {
    this.selectedAccount = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm(itemToEdit?: ICorporateAccount) {
    this.addEditForm = this.fb.group({
      corporateName: [itemToEdit ? itemToEdit.corporateName : '', Validators.required],
      address: [itemToEdit ? itemToEdit.address : '', Validators.required],
      contractImageURL: [itemToEdit ? itemToEdit.contractImageURL : '', Validators.required],
      email: [itemToEdit ? itemToEdit.email : '', Validators.required],
      phone: [itemToEdit ? itemToEdit.phone : '', Validators.required],
      password: [''],
      tripRate: [itemToEdit ? itemToEdit.tripRate : '', Validators.required],
      contactPerson: [itemToEdit ? itemToEdit.contactPerson : '', Validators.required],
      contactPersonPhone: [itemToEdit ? itemToEdit.contactPersonPhone : '', Validators.required],
    });
  }

  getModelFromForm(form: FormGroup) {
    let formData = new FormData();
    formData.append('_id', this.accountToEditId ? this.accountToEditId : null);
    formData.append('corporateName', form.get('corporateName').value);
    formData.append('address', form.get('address').value);
    formData.append('email', form.get('email').value);
    formData.append('phone', form.get('phone').value);
    formData.append('password', form.get('password').value);
    formData.append('tripRate', form.get('tripRate').value);
    formData.append('contactPerson', form.get('contactPerson').value);
    formData.append('contactPersonPhone', form.get('contactPersonPhone').value);

    if (this.fileToUpload !== null)
      formData.append('contractImageURL', this.fileToUpload, this.fileToUpload.name);

    return formData;
  }

  OnChangeFile(files: FileList) {
    this.fileToUpload = files.item(0);
    this.addEditForm.get('contractImageURL').setValue(environment.baseUrl + this.fileToUpload.name)
    this.shortImageName = this.fileToUpload.name;
  }

  add() {
    this.resError = '';
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.Edit_CORPORATE, model)
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
        this.dataService.add(Constant.ADD_CORPORATE, model)
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

  deleteItem() {
    this.dataService.delete(Constant.DELETE_CORPORATE, { itemId: this.selectedAccount._id })
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

  downloadContract(item: ICorporateAccount) {
    window.open(item.contractImageURL, 'blank');
  }

  openMembers(item: ICorporateAccount) {
    this._router.navigate([`/corporate-member`, item._id]);
  }

}
