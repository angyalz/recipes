import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModules } from './material.modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RecipesComponent } from './components/recipes/recipes.component';
import { NavComponent } from './components/nav/nav.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { UserRegComponent } from './components/user-reg/user-reg.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { OwnRecipesComponent } from './components/own-recipes/own-recipes.component';
import { JwtInterceptorService } from './services/jwt-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    RecipesComponent,
    NavComponent,
    RecipeComponent,
    AddRecipeComponent,
    UserRegComponent,
    UserLoginComponent,
    OwnRecipesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MaterialModules

  ],
  entryComponents: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
