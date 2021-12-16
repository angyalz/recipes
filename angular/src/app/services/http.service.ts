import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveNewRecipe(formData: FormData): Observable<any> {
    return this.http.post(this.URL + 'recipes', formData);
  }

  saveNewUser(user: any): Observable<any> {
    return this.http.post(this.URL + 'users', user);
  }

  getIngredients(): Observable<any> {
    return this.http.get<any[]>(this.URL + 'ingredients');
  }

  getRecipes(): Observable<any> {
    return this.http.get<any[]>(this.URL + 'recipes');
  }

  getRecipesByUser(user_id: string): Observable<any> {
    return this.http.get<any[]>(this.URL + 'recipes/?user_id=' + user_id);
  }

  getRecipeById(id: any): Observable<any> {
    return this.http.get<any[]>(this.URL + 'recipes/' + id);
  }

  getUnits(): Observable<any> {
    return this.http.get<any[]>(this.URL + 'units');
  }

  getUsers(): Observable<any> {
    return this.http.get<any[]>(this.URL + 'users');
  }

  getUserById(id: any): Observable<any> {
    return this.http.get<any[]>(this.URL + 'users/' + id);
  }

}
