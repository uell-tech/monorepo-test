/* eslint-disable no-debugger */
import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, exhaustMap, map, zip } from 'rxjs';
import {
  CoursesApiActions,
  UserCoursesPageActions,
  ViewCoursePageActions,
} from './courses.actions';
import { CoursesApiService } from '../services';
import { coursesFeature } from './courses.reducer';

@Injectable()
export class CoursesEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private coursesService = inject(CoursesApiService);

  pageOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserCoursesPageActions.opened),
      concatLatestFrom(() => [
        this.store.select(coursesFeature.selectAllCourses),
        this.store.select(coursesFeature.selectLastLesson),
      ]),
      exhaustMap(([, courses, lastLesson]) =>
        zip(
          courses.length ? of(courses) : this.coursesService.getUserCourses(),
          lastLesson ? of(lastLesson) : this.coursesService.getLastLessonInfo(),
        ),
      ),
      map(([courses, lastLessonInfo]) =>
        CoursesApiActions.coursesLoaded({ courses, lastLessonInfo }),
      ),
      catchError((errorMsg) => of(CoursesApiActions.coursesLoadedFailure({ errorMsg }))),
    ),
  );

  selectedCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ViewCoursePageActions.selectedCourse),
      exhaustMap(({ id: courseId }) =>
        this.coursesService
          .getCourseLessons(courseId)
          .pipe(map((lessons) => CoursesApiActions.lessonsLoaded({ courseId, lessons }))),
      ),
      catchError((errorMsg) => of(CoursesApiActions.lessonsLoadedFailure({ errorMsg }))),
    ),
  );
}
