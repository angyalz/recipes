import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { ValidationErrorHandlerService } from 'src/app/services/validation-error-handler.service';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})

export class AddRecipeComponent implements OnInit {

  requestProcessing: boolean = false;

  userObject: any;
  userSignInSubscription?: Subscription;

  ingredientList: string[] = [];
  unitList: string[] = [];

  filteredUnitOptions: Observable<string[]>[] = [];
  filteredIngredientOptions: Observable<string[]>[] = [];

  fileAttr: any = {
    multiple: false,
    accept: 'image/png, image/jpeg',
    color: 'accent',
    maxSize: 8
  }

  titlePattern: string | RegExp = '^[a-zA-Z0-9 íöüóőúűéáÍÖÜÓŐÚŰÉÁ ()\-–—"]+$';
  qtyPattern: string | RegExp = '^[0-9]+$';
  unitPattern: string | RegExp = '^[a-zA-Z íöüóőúűéáÍÖÜÓŐÚŰÉÁ]+$';
  ingredPattern: string | RegExp = '^[a-zA-Z0-9 íöüóőúűéáÍÖÜÓŐÚŰÉÁ()\-]+$';
  textPattern: string | RegExp = '^[a-zA-Z0-9 íöüóőúűéáÍÖÜÓŐÚŰÉÁ(),;?"\':\-–—]+$';

  addRecipe: FormGroup = this.formBuilder.group({

    userId: [''],

    title: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(48),
      Validators.pattern(this.titlePattern)
    ]),

    subtitle: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(48),
      Validators.pattern(this.titlePattern)
    ]),

    ingredients: this.formBuilder.array([]),

    methods: this.formBuilder.array([]),

    imageFile: new FormControl('', [
      Validators.required,
      MaxSizeValidator(this.fileAttr.maxSize * 1024 * 1024)
    ])

  });


  get title() {
    return this.addRecipe.controls["title"] as FormControl;
  }

  get subtitle() {
    return this.addRecipe.controls["subtitle"] as FormControl;
  }

  get ingredients() {
    return this.addRecipe.controls["ingredients"] as FormArray;
  }

  get methods() {
    return this.addRecipe.controls["methods"] as FormArray;
  }

  get imageFile() {
    return this.addRecipe.controls["imageFile"] as FormControl;
  }

  getQuantityControl(i: number): FormControl {
    const ingredientsArray = this.addRecipe.controls["ingredients"] as FormArray;
    const formGroup = ingredientsArray.at(i) as FormGroup;
    return formGroup.controls["quantity"] as FormControl;
  }

  getUnitControl(i: number): FormControl {
    const ingredientsArray = this.addRecipe.controls["ingredients"] as FormArray;
    const formGroup = ingredientsArray.at(i) as FormGroup;
    return formGroup?.controls["unit"] as FormControl;
  }

  getIngredientControl(i: number): FormControl {
    const ingredientsArray = this.addRecipe.controls["ingredients"] as FormArray;
    const formGroup = ingredientsArray.at(i) as FormGroup;
    return formGroup?.controls["ingredient"] as FormControl;
  }

  getIngredientsGroup(i: number): FormGroup {
    const ingredientsArray = this.addRecipe.controls["ingredients"] as FormArray;
    return ingredientsArray.at(i) as FormGroup;
  }

  getMethodsGroup(i: number): FormGroup {
    const methodsArray = this.addRecipe.controls["methods"] as FormArray;
    return methodsArray.at(i) as FormGroup;
  }

  manageIngredientControl(i: number) {
    this.filteredIngredientOptions[i] = this.getIngredientControl(i)?.valueChanges
      .pipe(
        startWith(''),
        map(value => this._ingredientFilter(value))
      )
  }

  manageUnitControl(i: number) {
    this.filteredUnitOptions[i] = this.getUnitControl(i)?.valueChanges
      .pipe(
        startWith(''),
        map(value => this._unitFilter(value))
      )
  }

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private validErrorHandler: ValidationErrorHandlerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getIngredients();
    this.getUnits();

    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe(
      (user) => { this.userObject = user }
    )
  }

  ngOnDestroy(): void {
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe()
  }

  private _ingredientFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ingredientList.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _unitFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.unitList.filter(option => option.toLowerCase().includes(filterValue));
  }

  addIngredient() {

    const ingredientForm =
      this.formBuilder.group({

        quantity: new FormControl('', [
          Validators.required,
          Validators.min(1),
          Validators.max(9999),
          Validators.pattern(this.qtyPattern)
        ]),

        unit: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(8),
          Validators.pattern(this.unitPattern)
        ]),

        ingredient: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32),
          Validators.pattern(this.ingredPattern)
        ])

      });

    this.ingredients.push(ingredientForm);
    this.manageIngredientControl(this.ingredients.length - 1);
    this.manageUnitControl(this.ingredients.length - 1);
  }

  addMethod() {

    const methodForm =
      this.formBuilder.group({

        method: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ])

      });

    this.methods.push(methodForm);
  }

  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }

  removeMethod(i: number) {
    this.methods.removeAt(i);
  }

  saveNewRecipe(recipe: any) {

    this.requestProcessing = true;

    let formData = new FormData();
    formData.append('imageFile', recipe.imageFile);

    recipe.userId = this.userObject.user_id;
    recipe.imageFile = recipe.imageFile.name;

    formData.append('recipe', JSON.stringify(recipe));

    this.httpService.saveNewRecipe(formData).subscribe(

      (data: any) => {
        this.addRecipe.reset();
        this._snackBar.open(`A recept sikeresen elmentve`, 'OK', { duration: 3000 });
        this.router.navigate(['/recipes']);
      },

      (err) => {
        this._snackBar.open(`Hoppá, valami döcög a szerverkapcsolatban: \nSzerverválasz: ${err.error}: ${err.status}`,
          'OK', {
          duration: 5000
        });
        console.error(err);
      },

      () => { this.requestProcessing = false }
    )
  }

  getIngredients() {
    this.httpService.getIngredients().subscribe(
      (ingredients) => {
        this.ingredientList = ingredients.map((i: { ingredientName: string; }) => i.ingredientName);
      },
      (err) => { console.error(err) },
      () => { }
    )
  }

  getUnits() {
    this.httpService.getUnits().subscribe(
      (units) => {
        this.unitList = units.map((u: { unitName: string; }) => u.unitName);
      },
      (err) => { console.error(err) },
      () => { }
    )
  }

  getErrorMessage(formName: FormGroup | FormArray, formControlName: string, i?: number) {
    return this.validErrorHandler.getRecipeErrorMessage(formName, formControlName);
  }

}