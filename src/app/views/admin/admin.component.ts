import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  admins: Admin[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;

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

  getAll() {
    this.dataService.GetAll(Constant.GET_ADMINS)
      .subscribe(
        (res: any) => {
          this.admins = res.items;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal) {
    this.buildForm();
    this.modalService.open(modal);
  }

  buildForm() {
    this.addEditForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      this.dataService.Add(Constant.ADD_ADMIN, this.addEditForm.value)
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
