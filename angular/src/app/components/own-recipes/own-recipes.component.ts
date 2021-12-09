import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-own-recipes',
  templateUrl: './own-recipes.component.html',
  styleUrls: ['./own-recipes.component.scss']
})

export class OwnRecipesComponent implements OnInit {

  componentLoading: boolean = true;

  userObject: any;
  userSignInSubscription?: Subscription;

  BASE_URL: string = environment.apiUrl + 'images/';
  missingImage: string = 'missing.jpg';
  recipeList: any[] = [];

  constructor(
    private httpService: HttpService,
    private _snackBar: MatSnackBar,
    public router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe(
      (user) => { this.userObject = user },
      (err) => { console.error(err) }
    )

    this.getRecipes();
  }

  ngOnDestroy(): void {
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe()
  }

  getRecipes() {

    this.componentLoading = true;

    this.httpService.getRecipesByUser(this.userObject.user_id).subscribe(

      (data: any[]) => {
        this.recipeList = data;
        console.log(this.recipeList);
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

  openCard(id: any) {
    console.log('id: ', id);
    this.router.navigate(['/recipe', id]);
  }

}
