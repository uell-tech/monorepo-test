import { NxWelcomeComponent } from './nx-welcome.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent],
  selector: 'emat-root',
  template: ` <emat-nx-welcome></emat-nx-welcome> `,
  styles: [],
})
export class AppComponent {
  title = 'my-app';
}
