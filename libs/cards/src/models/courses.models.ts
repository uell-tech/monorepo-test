import { EntityState } from '@ngrx/entity';

export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}
export interface ErrorState {
  errorMsg: string;
}

export type CallState = LoadingState | ErrorState;

export interface Course {
  id: number;
  title: string;
  amountLessonsCompleted: number;
  amountLessons: number;
  isFinished: boolean;
  lessonsIds: number[];
}

export interface Lesson {
  id: number;
  title: string;
  phase: string;
}

export interface LastLessonInfo {
  courseId: number;
  lessonId: number;
  lessonTitle: string;
}

export interface CoursesState extends EntityState<Course> {
  selectedCourseId: number | null;
  lastLesson: LastLessonInfo | undefined;
  callState: CallState;
}

export interface LessonsState extends EntityState<Lesson> {
  selectedLessonId: number | null;
  callState: CallState;
}
