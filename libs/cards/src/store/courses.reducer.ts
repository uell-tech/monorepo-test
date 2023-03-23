import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, createFeature, createSelector } from '@ngrx/store';
import {
  CoursesApiActions,
  UserCoursesPageActions,
  ViewCoursePageActions,
} from './courses.actions';
import { Course, CoursesState, LoadingState } from '../models';

const adapter = createEntityAdapter<Course>({
  selectId: ({ id }) => id,
});

const initialState: CoursesState = adapter.getInitialState({
  selectedCourseId: null,
  lastLesson: undefined,
  lessonsIds: [],
  callState: LoadingState.INIT,
});

const reducer = createReducer(
  initialState,

  on(UserCoursesPageActions.opened, (state) => ({
    ...state,
    callState: LoadingState.LOADING,
  })),

  on(CoursesApiActions.coursesLoaded, (state, { courses, lastLessonInfo }) =>
    adapter.setAll(courses, {
      ...state,
      lastLesson: lastLessonInfo,
      callState: LoadingState.LOADED,
    }),
  ),

  on(CoursesApiActions.coursesLoadedFailure, (state, { errorMsg }) => ({
    ...state,
    callState: { errorMsg },
  })),

  on(ViewCoursePageActions.selectedCourse, (state, { id }) => ({
    ...state,
    selectedCourseId: id,
  })),

  on(CoursesApiActions.lessonsLoaded, (state, { courseId, lessons }) =>
    adapter.updateOne(
      { id: courseId, changes: { lessonsIds: lessons.map(({ id }) => id) } },
      state,
    ),
  ),
);

const { selectAll } = adapter.getSelectors();

export const coursesFeature = createFeature({
  name: 'courses',
  reducer,
  extraSelectors: ({
    selectCoursesState,
    selectEntities,
    selectSelectedCourseId,
    selectLastLesson,
  }) => ({
    selectSelectedCourse: createSelector(
      selectEntities,
      selectSelectedCourseId,
      (entities, selectedId) => selectedId && entities[selectedId],
    ),

    selectAllCourses: createSelector(selectCoursesState, selectAll),

    selectLastLessonInfo: createSelector(
      selectLastLesson,
      selectEntities,
      (lastLesson, entities) => {
        if (!lastLesson) return undefined;
        return {
          course: entities[lastLesson.courseId],
          lesson: {
            id: lastLesson.lessonId,
            title: lastLesson.lessonTitle,
          },
        };
      },
    ),
  }),
});
