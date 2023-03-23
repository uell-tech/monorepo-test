import { lessonsFeature } from './lessons.reducer';
import { coursesFeature } from './courses.reducer';
import { createSelector } from '@ngrx/store';
import { Lesson } from '../models';

const selectLessonsSelectedCourse = createSelector(
  lessonsFeature.selectEntities,
  coursesFeature.selectSelectedCourse,
  (entities, course) => {
    return course
      ? course.lessonsIds
          .map((id) => entities[id])
          .filter((lesson): lesson is Lesson => lesson != null)
      : [];
  },
);

export const selectUserCoursesPageViewModel = createSelector({
  courses: coursesFeature.selectAllCourses,
  lastLesson: coursesFeature.selectLastLessonInfo,
  callState: coursesFeature.selectCallState,
});

export const selectSelectedCoursePageViewModel = createSelector({
  selectedCourse: coursesFeature.selectSelectedCourse,
  lessons: selectLessonsSelectedCourse,
  callState: lessonsFeature.selectCallState,
});

export const { selectEntities: selectCoursesEntities } = coursesFeature;
export const features = { coursesFeature, lessonsFeature } as const;
export * from './courses.actions';
export * from './courses.effects';
