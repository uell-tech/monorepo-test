import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialCommonModule } from '@emat/shared/ui/material';

@Component({
  standalone: true,
  selector: 'emat-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>404: No encontrado</mat-card-title>
      <mat-card-content>
        <p>¡Ey! Parece que esta página aún no existe.</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="accent" routerLink="/">Llévame a empezar</button>
      </mat-card-actions>
    </mat-card>
  `,
  imports: [MaterialCommonModule, RouterLink],
})
export class NotFoundPageComponent {}
