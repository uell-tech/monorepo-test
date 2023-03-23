import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgFor, NgIf } from '@angular/common';
import { LetModule } from '@ngrx/component';
import { selectSelectedCoursePageViewModel } from '../store';
import { CourseProgressComponent } from '../components/course-progress/course-progress.component';
import { CourseLessonsListComponent } from '../components/course-lessons-list/course-lessons-list.component';
import { RouterLink } from '@angular/router';
import { MaterialCommonModule } from '@emat/shared/ui/material';

@Component({
  standalone: true,
  selector: 'emat-selected-course-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngrxLet="vm$ as vm; error as e; complete as c">
      <emat-course-progress
        *ngIf="vm.selectedCourse"
        [course]="vm.selectedCourse"
        routerLink="/"
        tip="Atrás"
      />
      <emat-course-lessons-list
        *ngIf="vm.selectedCourse"
        [course]="vm.selectedCourse"
        [lessons]="vm.lessons"
      >
        <li *ngFor="let lesson of vm.lessons">
          <a [routerLink]="['lesson', lesson.id]">
            <span class="list-id"> {{ lesson.id }} </span>
            <span class="title">{{ lesson.title }}</span>
            <mat-icon svgIcon="eyes" class="list-icon"></mat-icon>
          </a>
        </li>
      </emat-course-lessons-list>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 20px;
        emat-course-lessons-list {
          flex: 1;
        }
      }
    `,
  ],

  imports: [
    MaterialCommonModule,
    LetModule,
    NgIf,
    NgFor,
    RouterLink,
    CourseProgressComponent,
    CourseLessonsListComponent,
  ],
})
export class selectedCoursePageComponent {
  protected readonly store = inject(Store);
  readonly vm$ = this.store.select(selectSelectedCoursePageViewModel);
}
