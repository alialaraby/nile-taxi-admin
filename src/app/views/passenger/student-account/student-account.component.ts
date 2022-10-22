import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IPassenger } from 'src/app/core/model/passenger';
import { DataService } from 'src/app/core/service/data.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-student-account',
  templateUrl: './student-account.component.html',
  styleUrls: ['./student-account.component.scss']
})
export class StudentAccountComponent implements OnInit {

  passengers: IPassenger[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  approveRequest: boolean = true;
  selectedRequest: IPassenger;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(
    private dataService: DataService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
    private passengerService: PassengerService,
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
    this.dataService.getAll(Constant.GET_STUDENT_REQUESTS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          this.passengers = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  pageChange(pageIndex: number) {
    this.getAll(pageIndex - 1);
  }

  downloadCertificate(item: IPassenger) {
    window.open(item.studentCertificate, 'blank');
  }

  openApproveModal(modal: any, item: IPassenger, approved: boolean) {
    this.selectedRequest = item;
    this.approveRequest = approved as boolean
    this.modalService.open(modal, { size: 'md' });
  }

  submit() {
    this.passengerService.respondStudentRequest({ _id: this.selectedRequest._id, approved: this.approveRequest })
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
