import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/model/user-login';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  hide = true;  // pwd visible switch

  loginSubscription: Subscription = new Subscription;
  userObject: any;

  userLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

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
          this.userLogin.reset();
          this._snackBar.open(`Sikeres belépés`, 'OK', { duration: 2000 });
          this.router.navigate(['/recipes']);
        }
      )
  }

  ngOnInit(): void {
  }

}
