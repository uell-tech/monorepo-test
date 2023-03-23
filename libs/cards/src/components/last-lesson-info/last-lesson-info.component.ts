import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MaterialCommonModule } from '@emat/shared/ui/material';
import { Course, Lesson } from '../../models';

@Component({
  standalone: true,
  selector: 'emat-last-lesson-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="card" appearance="outlined">
      <mat-card-title class="card-title"> Vuelve donde lo dejaste </mat-card-title>
      <mat-card-content class="card-content">
        <p>{{ description }}</p>
      </mat-card-content>
      <mat-card-actions class="card-actions">
        <ng-content></ng-content>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      :host {
        .card {
          min-height: 185px;
        }
      }
    `,
  ],
  imports: [MaterialCommonModule],
})
export class LastLessonInfoComponent {
  @Input() course?: Partial<Course>;
  @Input() lesson?: Partial<Lesson>;

  get description() {
    return (
      this.lesson && `${this.course?.title} - Sesión ${this.lesson?.id}, ${this.lesson?.title}`
    );
  }
}
