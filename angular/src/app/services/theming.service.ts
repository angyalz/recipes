import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {

  storedTheme: string | null = localStorage.getItem('theme');
  themes: string[] = ['dark-mode', 'light-mode', 'auto_mode'];
  theme: BehaviorSubject<string> = new BehaviorSubject(this.storedTheme || this.themes[0]);
  darkModeOn: boolean;

  constructor(private ref: ApplicationRef) {

    console.log('storedTheme: ', this.storedTheme);   // debug
    console.log('theme: ', this.theme);   // debug

    // Initially check if dark mode is enabled on system
    this.darkModeOn =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (this.storedTheme) {
      switch (this.storedTheme) {
        case this.themes[0]:
          this.theme.next(this.themes[0]);
          break;
        case this.themes[1]:
          this.theme.next(this.themes[1]);
          break;
        case this.themes[2]:
          this.theme.next((this.darkModeOn) ? this.themes[0] : this.themes[1])
          break;
      }
    } else {
      // If dark mode is enabled and theme not stored then directly switch to the dark-theme
      this.theme.next((this.darkModeOn) ? this.themes[0] : this.themes[1])
    }

    // Watch for changes of the preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const turnOn = e.matches;
      console.log('matchMedia turnOn: ', turnOn);     // debug
      this.theme.next(turnOn ? this.themes[0] : this.themes[1]);

      // Trigger refresh of UI
      this.ref.tick();
    });
  };
}
