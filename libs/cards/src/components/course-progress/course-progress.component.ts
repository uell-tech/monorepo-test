import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { MaterialCommonModule } from '@emat/shared/ui/material';
import { Course } from '../../models';

@Component({
  selector: 'emat-course-progress',
  standalone: true,
  imports: [MaterialCommonModule, NgIf, NgStyle],
  template: `
    <mat-card class="progress-card" [matTooltip]="tip">
      <mat-card-header class="progress-card-header">
        <mat-card-title-group>
          <mat-card-title>{{ title }}</mat-card-title>
          <mat-card-subtitle *ngIf="subtitle" class="progress-card-subtitle">{{
            subtitle
          }}</mat-card-subtitle>
          <span
            mat-card-avatar
            class="progress-card-percentage"
            [ngStyle]="{
              '--percentage': progress,
              '--c': isFinished ? 'white' : undefined
            }"
          >
            <mat-icon svgIcon="check" *ngIf="isFinished" class="progress-card-icon"></mat-icon>
          </span>
        </mat-card-title-group>
      </mat-card-header>
    </mat-card>
  `,
  styleUrls: ['./course-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseProgressComponent {
  @Input() course!: Course;
  @Input() tip = '';

  get title() {
    return this.course.title;
  }

  get subtitle() {
    return `${this.course.amountLessonsCompleted}/${this.course.amountLessons} sesiones`;
  }

  get progress() {
    return (100 * this.course.amountLessonsCompleted) / this.course.amountLessons;
  }

  get isFinished() {
    return this.course.isFinished;
  }
}
