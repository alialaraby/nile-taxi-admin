import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean;
  loadingText: string;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private responseHandler: ResponseHandlerService
    // private sharedData: SharedDataService,
    // private _dataService: DataService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loadingText = 'Logging in...';

      this.auth.login(this.loginForm.value)
        .subscribe(
          (res: any) => {
            this.router.navigate(['/dashboard']);
            // this.sharedData.setuserData(new UserCredentials(res.userId, res.token, res.fullname, res.username, RoleTypes.ADMIN));
            // this.sharedData.setauthenticated(true);
            // this.SetLocalStorageData(res, RoleTypes.ADMIN);
          }, (error) => {
            this.loginForm.setErrors({
              invalidLogin: true
            });
            this.loading = false;
            this.loadingText = 'Login';
          }
        );
    } else {
      this.loginForm.setErrors({
        invalidLogin: true
      });
      this.loading = false;
      this.loadingText = 'Login';
    }
  }

}
