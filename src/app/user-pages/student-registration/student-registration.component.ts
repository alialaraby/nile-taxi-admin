import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent implements OnInit {

  addEditForm: FormGroup;
  shortImageName: string = 'Add Certificate';
  fileToUpload: File[] = null;
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _responseHandler: ResponseHandlerService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addEditForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      studentCetificate: ['', Validators.required],
    });
  }

  OnChangeFile(files: File[]) {
    this.fileToUpload = files;
    this.shortImageName = 'File added';
  }

  getModelFromForm(form: FormGroup) {
    let formData = new FormData();
    formData.append('fullName', form.get('fullName').value);
    formData.append('email', form.get('email').value);
    formData.append('phone', form.get('phone').value);
    formData.append('gender', form.get('gender').value);
    formData.append('age', form.get('age').value);
    if(this.fileToUpload){
      formData.append('studentCetificate', this.fileToUpload[0], this.fileToUpload[0].name);
    }

    return formData;
  }

  submit() {
    this.submitting = true;
    if (!this.addEditForm.invalid) {
      let model = this.getModelFromForm(this.addEditForm);
      this.dataService.add(Constant.REGISTER_STUDENT, model)
        .subscribe(
          (res: any) => {
            this._responseHandler.HandleSuccess(res, ResponseActionType.Submitted);
            this.fileToUpload = null;
            this.shortImageName = 'Add Certificate';
            this.buildForm();
            this.submitting = false;
          },
          (error) => {
            this._responseHandler.HandelError(error);
            this.buildForm();
            this.submitting = false;
          }
        );
    }
  }

}
