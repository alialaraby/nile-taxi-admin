import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ICorporateAccount } from 'src/app/core/model/corporate-account';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IPassenger } from 'src/app/core/model/passenger';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-corporate-member',
  templateUrl: './corporate-member.component.html',
  styleUrls: ['./corporate-member.component.scss']
})
export class CorporateMemberComponent implements OnInit {

  members: IPassenger[] = [];
  selectedAccount: ICorporateAccount;
  selectedMember: IPassenger;
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

  constructor(
    private route: ActivatedRoute,
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
    this.route.params.subscribe(params => {
      this.getCorporate(params['_id'], this.pageIndex - 1, this.pageSize);
    });
  }

  getCorporate(_id: string, pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getCorporateMembers(Constant.GET_CORPORATE_BY_ID, _id, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.selectedAccount = res.item;
          this.members = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, itemToEdit: IPassenger = null) {
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

  openDeleteItem(modal: any, item: IPassenger) {
    this.selectedMember = item;
    this.modalService.open(modal, { size: 'sm' });
  }

  buildForm(itemToEdit?: IPassenger) {
    this.addEditForm = this.fb.group({
      fullName: [itemToEdit ? itemToEdit.fullName : '', Validators.required],
      email: [itemToEdit ? itemToEdit.email : '', Validators.required],
      phone: [itemToEdit ? itemToEdit.phone : '', Validators.required],
      gender: [itemToEdit ? itemToEdit.gender : '', Validators.required]
    });
  }

  getModelFromForm(form: FormGroup) {
    let model = {
      _id: this.accountToEditId ? this.accountToEditId : null,
      corporateId: this.selectedAccount._id,
      fullName: form.get('fullName').value,
      email: form.get('email').value,
      phone: form.get('phone').value,
      gender: form.get('gender').value,
    };

    return model;
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      if (this.isEditItem) {
        this.dataService.update(Constant.Edit_CORPORATE, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Updated);
              this.getCorporate(this.selectedAccount._id);
              this.modalService.dismissAll();
            },
            (error) => {
              this.gettingData = false;
              this._responseHandler.HandelError(error);
              this.modalService.dismissAll();
            }
          );
      } else {
        this.dataService.add(Constant.ADD_CORPORATE_MEMBER, model)
          .subscribe(
            (res: any) => {
              this._responseHandler.HandleSuccess(res, ResponseActionType.Added);
              this.getCorporate(this.selectedAccount._id);
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
    this.dataService.delete(Constant.DELETE_CORPORATE, { itemId: this.selectedAccount._id })
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Deleted);
          this.getCorporate(this.selectedAccount._id);
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
    this.getCorporate(this.selectedAccount._id, pageIndex - 1);
  }

}
