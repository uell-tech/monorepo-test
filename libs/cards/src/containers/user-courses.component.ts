import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { MaterialCommonModule } from '@emat/shared/ui/material';
import { CourseProgressComponent, LastLessonInfoComponent } from '../components';

import { Course } from '../models';
import { selectUserCoursesPageViewModel, UserCoursesPageActions } from '../store';

@Component({
  selector: 'emat-user-courses',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngrxLet="vm$ as vm">
      <!--<pre>{{ vm | json }}</pre>-->
      <emat-last-lesson-info [course]="vm.lastLesson?.course" [lesson]="vm.lastLesson?.lesson">
        <!-- @todo emat-button -->
        <ng-container *ngIf="vm.lastLesson as last">
          <button mat-raised-button color="accent" [routerLink]="['course', last.course?.id]">
            <mat-icon svgIcon="play"></mat-icon> Reproducción ordenada
          </button>
          <button
            mat-stroked-button
            color="accent"
            [routerLink]="['course', last.course?.id, 'lesson', last.lesson.id]"
          >
            <mat-icon svgIcon="shuffle-one"></mat-icon> Aleatorio
          </button>
          <button
            mat-stroked-button
            color="accent"
            [routerLink]="['course', last.course?.id, 'lesson', last.lesson.id]"
          >
            <mat-icon svgIcon="next"></mat-icon> Siguiente sesión
          </button>
        </ng-container>
      </emat-last-lesson-info>

      <section>
        <h2 class="mat-headline-4">Temario</h2>
        <div class="cards">
          <emat-course-progress
            *ngFor="let course of vm.courses; trackBy: trackByFn"
            [routerLink]="['course', course.id]"
            [course]="course"
          />
        </div>
      </section>
    </ng-container>
  `,
  //Container components are permitted to have minimal styles
  //necessary to organize the view. If the number of styles increases,
  //consider splitting them into presentational components.
  styles: [
    `
      .cards {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
    `,
  ],
  imports: [
    MaterialCommonModule,
    NgForOf,
    NgIf,
    JsonPipe,
    LetModule,
    RouterLink,
    LastLessonInfoComponent,
    CourseProgressComponent,
  ],
})
export class UserCoursesComponent implements OnInit {
  private readonly store = inject(Store);
  readonly vm$ = this.store.select(selectUserCoursesPageViewModel);

  ngOnInit() {
    this.store.dispatch(UserCoursesPageActions.opened());
  }

  trackByFn(_index: number, item: Course) {
    return item.id;
  }
}
