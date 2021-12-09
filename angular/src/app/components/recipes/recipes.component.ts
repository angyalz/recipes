import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  componentLoading: boolean = true;

  BASE_URL: string = environment.apiUrl + 'images/';
  missingImage: string = 'missing.jpg';
  recipeList: any[] = [];

  constructor(
    private httpService: HttpService, 
    private _snackBar: MatSnackBar, 
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes() {

    this.componentLoading = true;

    this.httpService.getRecipes().subscribe(

      (data: any[]) => {
        this.recipeList = data;
        for (const recipe of this.recipeList) {
          if (
            recipe.imageSource === undefined || 
            recipe.imageSource === ''
            ) {
            recipe.imageSource = this.missingImage;
          }
        }
      },

      (err) => {
        this._snackBar.open(`Hoppá, valami döcög a szerverkapcsolatban: \nSzerverválasz: ${err.statusText}: ${err.status}`, 'Rendben');
        console.log(err);
      },

      () => {
        this.componentLoading = false;
      }
    )
  };

}
