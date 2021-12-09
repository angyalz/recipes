import { Input } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Input()

export class AppComponent {

  title = 'recipe-collection-app';

}
