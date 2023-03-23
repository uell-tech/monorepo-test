import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../store/app.reducer';
import { NavItemComponent } from '@emat/shared/components';
import { ToolbarComponent } from '@emat/shared/components';
import { RouterOutlet } from '@angular/router';
import { IconService } from '@emat/shared/services';
import { MaterialCommonModule } from '@emat/shared/ui/material';
import { ConfigPageComponent } from './config-page.component';
import { closeSidenav, openSidenav } from '../store';
import { PushModule } from '@ngrx/component';

export const imports = [
  MaterialCommonModule,
  PushModule,
  NgIf,
  RouterOutlet,
  NavItemComponent,
  ToolbarComponent,
  ConfigPageComponent,
];
@Component({
  standalone: true,
  selector: 'emat-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-sidenav-container fullscreen>
      <mat-sidenav
        #sidenav
        [opened]="(showSidenav$ | ngrxPush)!"
        (closedStart)="closeSidenav()"
        mode="over"
        position="end"
        [fixedInViewport]="true"
        disableClose
      >
        <ng-container *ngIf="showSidenav$ | ngrxPush">
          <emat-config-page></emat-config-page>
        </ng-container>
      </mat-sidenav>

      <emat-toolbar (openMenu)="openSidenav()">
        <emat-nav-item routerLink="/cards" icon="suite" hint="Tarjetas" />
        <emat-nav-item (click)="openSidenav()" icon="config" hint="Configuración" />
        <emat-nav-item routerLink="/exit" icon="cerrar" hint="Salir (xy)" />
      </emat-toolbar>

      <router-outlet></router-outlet>
    </mat-sidenav-container>
  `,
  imports,
})
export class AppComponent {
  private readonly store = inject(Store);

  showSidenav$ = this.store.select(fromRoot.selectShowSidenav);
  constructor() {
    inject(IconService).registerIcons();
  }

  closeSidenav() {
    this.store.dispatch(closeSidenav());
  }

  openSidenav() {
    this.store.dispatch(openSidenav());
  }

  logout() {
    //this.store.dispatch(AuthActions.logoutConfirmation());
  }
}
