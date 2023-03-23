import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, createFeature, createSelector } from '@ngrx/store';
import { CoursesApiActions, UserCoursesPageActions } from './courses.actions';
import { Lesson, LessonsState, LoadingState } from '../models';

const adapter = createEntityAdapter<Lesson>({
  selectId: ({ id }) => id,
});

const initialState: LessonsState = adapter.getInitialState({
  selectedLessonId: null,
  callState: LoadingState.INIT,
});

const reducer = createReducer(
  initialState,

  on(UserCoursesPageActions.opened, (state) => ({
    ...state,
    callState: LoadingState.LOADING,
  })),

  on(CoursesApiActions.lessonsLoaded, (state, { lessons }) => adapter.addMany(lessons, state)),
  on(CoursesApiActions.lessonsLoaded, (state) => ({
    ...state,
    callState: LoadingState.LOADED,
  })),

  on(CoursesApiActions.lessonsLoadedFailure, (state, { errorMsg }) => ({
    ...state,
    callState: { errorMsg },
  })),
);

const { selectAll } = adapter.getSelectors();

export const lessonsFeature = createFeature({
  name: 'lessons',
  reducer,
  extraSelectors: ({ selectLessonsState, selectEntities, selectSelectedLessonId }) => ({
    selectSelectedLesson: createSelector(
      selectEntities,
      selectSelectedLessonId,
      (entities, selectedId) => selectedId && entities[selectedId],
    ),

    selectAllLessons: createSelector(selectLessonsState, selectAll),
  }),
});
