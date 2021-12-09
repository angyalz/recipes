import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class ValidationErrorHandlerService {

  constructor() { }

  getRecipeErrorMessage(formName: FormGroup | FormArray, field: string) {

    if (formName.get(field)?.hasError('required')) {
      return 'Kötelezően kitöltendő mező';
    }

    if (formName.get(field)?.hasError('pattern')) {
      switch (field) {
        case 'quantity':
          return 'csak számokat tartalmazhat';
        case 'unit':
          return 'csak betűket tartalmazhat';
        case 'ingredient':
          return 'betűket és számokat tartalmazhat';
        case 'title':
          return 'csak betűket, számokat, zárójelet, kötőjelet és gondolatjelet tartalmazhat';
        case 'subtitle':
          return 'csak betűket, számokat, zárójelet, kötőjelet és gondolatjelet tartalmazhat';
      }
    }

    if (formName.get(field)?.hasError('minlength') || formName.get(field)?.hasError('maxlength')) {
      switch (field) {
        case 'title':
          return 'minimum 4, maximum 48 karaktert tartalmazhat';
        case 'subtitle':
          return 'minimum 4, maximum 48 karaktert tartalmazhat';
        case 'method':
          return 'minimum 3 karaktert szükséges megadni';
        case 'unit':
          return 'minimum 1, maximum 8 karaktert tartalmazhat';
        case 'ingredient':
          return 'minimum 2, maximum 32 karaktert tartalmazhat';
      }
    }

    if (formName.get(field)?.hasError('min') || formName.get(field)?.hasError('max')) {
      switch (field) {
        case 'quantity':
          return '1 és 9999 közötti érték adható meg';
      }
    }

    return 'egyéb validációs hiba';

  }

  getRegErrorMessage(formName: FormGroup | FormArray, field: string) {

    if (formName.get(field)?.hasError('required')) {
      return 'Kötelezően kitöltendő mező';
    }

    if (formName.get(field)?.hasError('pattern')) {
      return 'betűket és számokat tartalmazhat';
    }

    if (formName.get(field)?.hasError('email')) {
      return 'valós email cím megadása szükséges';
    }

    if (formName.get(field)?.hasError('minlength') || formName.get(field)?.hasError('maxlength')) {
      return 'minimum 8 karaktert szükséges megadni';
    }

    if (formName.get(field)?.hasError('maxlength') || formName.get(field)?.hasError('maxlength')) {
      return 'maximum 32 karaktert tartalmazhat';
    }

    return 'egyéb validációs hiba';

  }

}
