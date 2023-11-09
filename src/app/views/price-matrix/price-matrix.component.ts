import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { IPriceMatrix } from 'src/app/core/model/price-matrix';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-price-matrix',
  templateUrl: './price-matrix.component.html',
  styleUrls: ['./price-matrix.component.scss']
})
export class PriceMatrixComponent implements OnInit {

  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;

  priceMatrix: IPriceMatrix[] = [];
  matrixRow: any[] = [];

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
    this.getPriceMatrix()
  }

  getPriceMatrix() {
    this.gettingData = true;
    this.dataService.getPriceMatrix(Constant.GET_PRICE_MATRIX)
      .subscribe(
        (res: any) => {
          this.priceMatrix = res.items;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openPriceMatrix(modal) {
    this.modalService.open(modal, { size: 'lg' });
  }

  changePrice(row, column, value) {
    let priceM: IPriceMatrix;
    let oldValue;
    if (row == 4) {
      priceM = this.priceMatrix.find(x => x.name == 'zone 5a');
      oldValue = priceM.toZonesPrices[column];
      priceM.toZonesPrices[column] = value;
    } else if (row == 5) {
      priceM = this.priceMatrix.find(x => x.name == 'zone 5b');
      oldValue = priceM.toZonesPrices[column];
      priceM.toZonesPrices[column] = value;
    } else if (row == 6) {
      priceM = this.priceMatrix.find(x => x.name == `zone 6`);
      oldValue = priceM.toZonesPrices[column];
      priceM.toZonesPrices[column] = value;
    } else {
      priceM = this.priceMatrix.find(x => x.name == `zone ${row + 1}`);
      oldValue = priceM.toZonesPrices[column];
      priceM.toZonesPrices[column] = value;
    }

    if (oldValue != value) {
      this.dataService.update(Constant.UPDATE_PRICE_MATRIX, { item: priceM })
        .subscribe(
          (res: any) => {
            this._responseHandler.HandleSuccess(res, ResponseActionType.Updated);
            this.getPriceMatrix();
          },
          (error) => {
            this.gettingData = false;
            this._responseHandler.HandelError(error);
          }
        );
    }

  }

}
