import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCommonModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

const materialModules = [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatCommonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    NgxMatFileInputModule,
    MatAutocompleteModule,
    MatDialogModule,
]

@NgModule({
    imports: [...materialModules],
    exports: [...materialModules],
})

export class MaterialModules { }