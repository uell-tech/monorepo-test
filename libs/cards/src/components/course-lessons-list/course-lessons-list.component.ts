import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MaterialCommonModule } from '@emat/shared/ui/material';
import { Course, Lesson } from '../../models';

@Component({
  selector: 'emat-course-lessons-list',
  standalone: true,
  imports: [MaterialCommonModule, NgIf, NgFor],
  template: `
    <mat-card class="lessons-list" appearance="outlined">
      <mat-card-header class="card-header">
        <mat-card-title-group class="card-header-title-group">
          <mat-card-title>Sesiones del {{ title }}</mat-card-title>
          <span class="card-progress">
            {{ progress }}
          </span>
        </mat-card-title-group>
      </mat-card-header>
      <mat-card-content class="box">
        <ul class="list">
          <ng-content></ng-content>
        </ul>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./course-lessons-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CourseLessonsListComponent {
  @Input() course!: Course;
  @Input() lessons!: Lesson[];

  get title() {
    return this.course.title;
  }

  get progress() {
    return `${this.course.amountLessonsCompleted}/${this.course.amountLessons}`;
  }

  get isFinished() {
    return this.course.isFinished;
  }

  trackByFn(_index: number, item: Lesson) {
    return item.id;
  }
}
