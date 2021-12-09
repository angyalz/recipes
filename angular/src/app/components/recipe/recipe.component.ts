import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit {

  componentLoading: boolean = true;

  BASE_URL: string = environment.apiUrl + 'images/';
  missingImage: string = 'missing.jpg';

  recipe: any = {
    imageSource: this.missingImage
  };

  constructor(
    private httpService: HttpService, 
    private route: ActivatedRoute, 
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.getRecipeById();
  }

  getRecipeById() {

    this.componentLoading = true;

    const id = this.route.snapshot.paramMap.get('id');

    this.httpService.getRecipeById(id).subscribe(

      (data: any[]) => {

        this.recipe = data;

        if (
          this.recipe.imageSource == undefined ||
          this.recipe.imageSource === ''
        ) {
          this.recipe.imageSource = this.missingImage;
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
