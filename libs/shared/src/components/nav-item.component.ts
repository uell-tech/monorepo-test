import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialCommonModule } from '../ui/material';

@Component({
  standalone: true,
  selector: 'emat-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      mat-fab
      [matTooltip]="hint"
      color="primary"
      aria-label="Example fab with a heart icon"
      [routerLink]="routerLink"
      (click)="navigate.emit()"
    >
      <ng-content></ng-content>
      <mat-icon [svgIcon]="icon" />
    </a>
  `,
  imports: [RouterLink, MaterialCommonModule],
  styles: [``],
})
export class NavItemComponent {
  @Input() icon = '';
  @Input() hint = '';
  @Input() routerLink!: string;
  @Output() navigate = new EventEmitter();
}
