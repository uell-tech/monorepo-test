import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialCommonModule } from '@emat/shared/ui/material';
import { Store } from '@ngrx/store';

import { closeSidenav } from '../store';

@Component({
  standalone: true,
  selector: 'emat-config-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card appearance="outlined" class="card">
      <mat-card-title class="card-title">
        <h2 class="mat-headline-4">Configuración</h2>
      </mat-card-title>
      <mat-card-content class="card-content">
        <mat-form-field appearance="outline">
          <mat-label>Idioma</mat-label>
          <mat-select
            [(value)]="language"
            hideSingleSelectionIndicator="false"
            panelClass="select-custom-style"
          >
            <mat-option value="es" selected>Español</mat-option>
            <mat-option value="en">Inglés</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Curso</mat-label>
          <mat-select
            [(value)]="course"
            hideSingleSelectionIndicator="false"
            panelClass="select-custom-style"
          >
            <mat-option value="3">3º de infantil</mat-option>
            <mat-option value="4">4º de infantil</mat-option>
            <mat-option value="5">5º de infantil</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions class="card-actions">
        <button mat-raised-button color="accent" (click)="close()" routerLink="/">
          Guardar cambios
        </button>
        <a mat-button (click)="close()"> Cerrar sin guardar </a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        width: 502px;
        max-width: calc(100vw - 16px);
      }
      .card {
        padding: 35px 80px 24px 80px;
      }
      .card-content {
        margin-top: 74px;
        display: flex;
        flex-direction: column;
      }
      .card-actions {
        flex-direction: column;
        margin-top: 205px;
      }
    `,
  ],
  imports: [MaterialCommonModule, RouterLink],
})
export class ConfigPageComponent {
  private store = inject(Store);
  language = 'es';
  course = '3';
  close() {
    this.store.dispatch(closeSidenav());
  }
}
