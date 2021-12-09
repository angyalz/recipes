import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  menu = {
    visible: false,
    title: ''
  }

  userObject: any;
  userSignInSubscription?: Subscription;
  userLogoutSubscription?: Subscription;
  userRefreshSubscription?: Subscription;

  loggedIn = false;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('refreshToken')) {
      this.userRefreshSubscription = this.authService.refreshUserAuthentication().subscribe()
    }

    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe(
      (user) => { 
        this.userObject = user;
        this.loggedIn = Boolean(this.userObject);
      },
      (err) => { },
      () => {
        
      }
    )

  }

  ngOnDestroy(): void {

    if (this.userLogoutSubscription) this.userLogoutSubscription.unsubscribe();
    if (this.userRefreshSubscription) this.userRefreshSubscription.unsubscribe();
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();

  }

  logout() {
    this.userLogoutSubscription = this.authService.logout().subscribe(
      () => { },
      (err) => { err },
      () => {
        this._snackBar.open(`Sikeres kilépés`, 'OK', { duration: 2000 });
        this.router.navigate([''])
      }
    )
  }

}


