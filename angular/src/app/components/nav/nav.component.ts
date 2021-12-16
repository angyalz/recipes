import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ThemingService } from 'src/app/services/theming.service';
import { UserLoginComponent } from '../user-login/user-login.component';
import { UserRegComponent } from '../user-reg/user-reg.component';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  // menu = {
  //   visible: false,
  //   title: ''
  // }

  userObject: any;
  userSignInSubscription?: Subscription;
  userLogoutSubscription?: Subscription;
  userRefreshSubscription?: Subscription;

  loggedIn = false;

  themes!: Array<string>;
  theme!: string;
  darkModeOn!: boolean;
  themeMode: string = 'light_mode';
  themeToolTip!: string;
  themingSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private theming: ThemingService,
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('refreshToken')) {
      this.userRefreshSubscription = this.authService.refreshUserAuthentication().subscribe(
        () => { },
        (err) => {
          this._snackBar.open(`A munkamenet lejárt, lépj be újra!`, 'OK', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
          this.openLoginDialog();
        },
        () => { }
      )
    }

    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe(
      (user) => { 
        this.userObject = user;
        this.loggedIn = Boolean(this.userObject);
        console.log('user: ', this.userObject);   // debug
      },
      (err) => { console.error(err) },
      () => { console.log('user: ', this.userObject) }    // debug
    )

    this.themes = this.theming.themes;

    this.themingSubscription = this.theming.theme.subscribe(
      (theme) => {
        this.theme = theme;
        if (localStorage.getItem('theme') !== 'auto_mode') {
          switch (this.theme) {
            case this.themes[0]:
              this.themeMode = 'dark_mode'
              break;
            case this.themes[1]:
              this.themeMode = 'light_mode'
              break;
            case this.themes[2]:
              this.themeMode = 'brightness_auto'
              break;
          };
        } else {
          this.themeMode = 'brightness_auto';
          this.theme = this.themes[2];
        }
      }
    )
    this.darkModeOn = this.theming.darkModeOn;

  }

  ngOnDestroy(): void {

    if (this.userLogoutSubscription) this.userLogoutSubscription.unsubscribe();
    if (this.userRefreshSubscription) this.userRefreshSubscription.unsubscribe();
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
    if (this.themingSubscription) this.themingSubscription.unsubscribe();

  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(UserLoginComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }

  openRegDialog(): void {
    const dialogRef = this.dialog.open(UserRegComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }

  logout() {
    this.userLogoutSubscription = this.authService.logout().subscribe(
      () => { },
      (err) => { err },
      () => {
        this._snackBar.open(`Sikeres kilépés`, 'OK', {
          duration: 2000,
          panelClass: ['snackbar-ok']
        });
        this.router.navigate([''])
      }
    )
  }

  changeTheme(): void {

    console.log(window.matchMedia('(prefers-color-scheme: dark)'));   // debug

    switch (this.theme) {
      case this.themes[0]:
        this.theme = this.themes[1];
        this.themeMode = 'light_mode';
        this.themeToolTip = 'Light Theme';
        localStorage.setItem('theme', this.theme);
        this.theming.theme.next(this.theme);
        break;
      case this.themes[1]:
        this.theme = this.themes[2];
        this.themeMode = 'brightness_auto';
        this.themeToolTip = 'Auto by OS theme';
        localStorage.setItem('theme', this.theme);
        // this.theming.theme.next(this.theme);
        this.theming.theme.next((this.darkModeOn) ? this.themes[0] : this.themes[1]);
        break;
      case this.themes[2]:
        this.theme = this.themes[0];
        this.themeMode = 'dark_mode';
        this.themeToolTip = 'Dark Theme';
        localStorage.setItem('theme', this.theme);
        this.theming.theme.next(this.theme);
        break;
    }

  }

}


