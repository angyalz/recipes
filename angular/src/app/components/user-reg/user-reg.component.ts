import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserLogin } from 'src/app/model/user-login';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { ValidationErrorHandlerService } from 'src/app/services/validation-error-handler.service';

@Component({
  selector: 'app-user-reg',
  templateUrl: './user-reg.component.html',
  styleUrls: ['./user-reg.component.scss']
})
export class UserRegComponent implements OnInit {

  hide = true;
  userList: any[] = [];

  loginSubscription: Subscription = new Subscription;
  userObject: any;

  namePattern: string | RegExp = '^[a-zA-Z0-9 íöüóőúűéáÍÖÜÓŐÚŰÉÁ]+$';

  userReg = new FormGroup({
    username: new FormControl('',
      {
        validators: [
          Validators.required,
          Validators.pattern(this.namePattern)
        ],
        updateOn: 'blur'
      }
    ),
    email: new FormControl('',
      {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'blur'
      }
    ),
    password: new FormControl('',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32)
      ]
    ),
    passCheck: new FormControl('',
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
        ]
      }
    ),
  });

  get username() {
    return this.userReg.controls['username'] as FormControl;
  }

  get email() {
    return this.userReg.controls['email'] as FormControl;
  }

  get password() {
    return this.userReg.controls['password'] as FormControl;
  }

  get passCheck() {
    return this.userReg.controls['passCheck'] as FormControl;
  }

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private validErrorHandler: ValidationErrorHandlerService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  saveUser(user: any) {

    this.httpService.saveNewUser(user).subscribe(

      (data: any) => {
        this.userReg.reset();
        this._snackBar.open(`Sikeres regisztáció`, 'OK', { duration: 3000 });
        this.login(user);
      },

      (err) => {
        this._snackBar.open(`Hoppá, valami döcög a szerverkapcsolatban: \nSzerverválasz: ${err.statusText}: ${err.status}`,
          'OK', {
          duration: 5000
        });
        console.log(err);
      },

      () => {}
    )
  }

  login(user: UserLogin) {

    this.loginSubscription = this.authService.login(user)
      .subscribe(
        () => { },
        (err) => {
          this._snackBar.open(`Hoppá, nem sikerült bejelentkezni! \nSzerverválasz: ${err.error}\nKód: ${err.status}`,
            'OK', {
            duration: 5000
          });
          console.error(err);
        },
        () => {
          this._snackBar.open(`Sikeres belépés`, 'OK', { duration: 2000 });
          this.router.navigate(['/recipes']);
        }
      )
  }

  getErrorMessage(formName: FormGroup, formControlName: string, i?: number) {
    return this.validErrorHandler.getRegErrorMessage(formName, formControlName);
  }

}
