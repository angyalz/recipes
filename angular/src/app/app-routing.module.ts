import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { OwnRecipesComponent } from './components/own-recipes/own-recipes.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegComponent } from './components/user-reg/user-reg.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: "", component: RecipesComponent },
  { path: "add-recipe", component: AddRecipeComponent, canActivate: [AuthGuardService]  },
  { path: "own-recipes", component: OwnRecipesComponent, canActivate: [AuthGuardService] },
  { path: "recipe/:id", component: RecipeComponent },
  { path: "user-reg", component: UserRegComponent },
  { path: "user-login", component: UserLoginComponent },
  { path: "**", redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
