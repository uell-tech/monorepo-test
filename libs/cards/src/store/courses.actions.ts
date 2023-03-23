import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Course, Lesson, LastLessonInfo } from '../models';

export const CoursesApiActions = createActionGroup({
  source: 'Courses Api',
  events: {
    'Courses Loaded': props<{
      courses: Course[];
      lastLessonInfo: LastLessonInfo;
    }>(),
    'Courses Loaded Failure': props<{ errorMsg: string }>(),
    'Lessons Loaded': props<{ courseId: number; lessons: Lesson[] }>(),
    'Lessons Loaded Failure': props<{ errorMsg: string }>(),
  },
});

export const UserCoursesPageActions = createActionGroup({
  source: 'Courses Page',
  events: {
    Opened: emptyProps(),
  },
});

export const ViewCoursePageActions = createActionGroup({
  source: 'View Course Page',
  events: {
    ['Selected Course']: props<{ id: number }>(),
  },
});
