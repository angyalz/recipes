import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoggedInUser } from '../model/logged-in-user';
import { UserLogin } from '../model/user-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL = environment.apiUrl;
  userLoggedInObject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  login(loginData: UserLogin): Observable<LoggedInUser> {

    return this.http.post<LoggedInUser>(this.BASE_URL + 'login', loginData)
      .pipe(
        tap(
          (loginData: LoggedInUser) => {
            if (loginData) {
              localStorage.setItem('accessToken', loginData.accessToken);
                localStorage.setItem('refreshToken', loginData.refreshToken);
              this.userLoggedInObject.next(
                {
                  username: loginData.username,
                  user_id: loginData.user_id,
                  role: loginData.role
                });
            }
          },
          (err) => {
            console.error('login error: ', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          })
      )
  }

  refreshUserAuthentication(): Observable<any> {
    return this.http.post<any>(this.BASE_URL + 'refresh', { token: localStorage.getItem('refreshToken') })
      .pipe(
        tap(
          (res) => {
            if (res) {
              localStorage.setItem('accessToken', res.accessToken);
              this.userLoggedInObject.next( res.userData );
            }

          },
          (err) => {
            console.error('auth refresh error: ', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          })
      )
  }

  logout() {
    const token = {
      token: localStorage.getItem('refreshToken')
    };

    return this.http.post(this.BASE_URL + 'logout', token)
      .pipe(
        tap(
          (res) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          },
          (err) => {
            console.error('logout error: ', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          })
      )
  }

  getUserLoggedInObj() {
    return this.userLoggedInObject.asObservable();
  }

  getUserAuthData() {
    return this.userLoggedInObject.value;
  }

}
