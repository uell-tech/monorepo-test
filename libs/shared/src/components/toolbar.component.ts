import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialCommonModule } from '../ui/material';

@Component({
  standalone: true,
  selector: 'emat-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <h1>
        <a routerLink="/" rel="home" aria-label="Tarjetas"> Tarjetas </a>
      </h1>
      <ng-content></ng-content>
    </mat-toolbar>
  `,
  styles: [
    `
      :host {
        width: 100%;
        background: var(--color-primary-default);
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
      }
      .app-toolbar {
        height: 90px;
        padding: 0 16px;
        gap: 6px;
        max-width: 100%;
        margin: 0 auto;

        a {
          color: var(--palette-neutral100);
          text-decoration: none;
        }
        h1 {
          margin: 0;
          margin-right: auto;
        }
      }

      @media (min-width: 700px) {
        .app-toolbar {
          padding: 0 60px;
          gap: 18px;
          max-width: 1024px;
        }
      }
    `,
  ],
  imports: [MaterialCommonModule, RouterLink],
})
export class ToolbarComponent {}
