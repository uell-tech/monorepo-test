import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CourseExistsGuard } from './course-exists.guard';
import { CoursesEffects, features } from './store';

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideState(features.coursesFeature),
      provideState(features.lessonsFeature),
      provideEffects(CoursesEffects),
    ],
    children: [
      {
        path: 'course/:courseId',
        canActivate: [CourseExistsGuard],
        children: [
          {
            path: 'lesson/:lessonId',
            loadComponent: () => import('./containers').then((x) => x.LessonPageComponent),
            data: { title: 'Sesión' },
          },
          {
            path: '',
            loadComponent: () => import('./containers').then((x) => x.ViewCoursePageComponent),
            data: { title: 'Sesiones' },
          },
        ],
      },
      {
        path: '',
        loadComponent: () => import('./containers').then((x) => x.UserCoursesComponent),
        data: { title: 'Panel' },
      },
    ],
  },
];
