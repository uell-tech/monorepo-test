import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Course, LastLessonInfo, Lesson } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CoursesApiService {
  protected readonly http = inject(HttpClient);
  protected readonly isInBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected serverUrl = '/mocks';

  getUserCourses() {
    return this.http.get<Course[]>(`${this.serverUrl}/courses/index.json`);
  }

  getCourseLessons(courseId: number) {
    return this.http.get<Lesson[]>(`${this.serverUrl}/lessons/course-id/${Number(courseId)}.json`);
  }

  getLastLessonInfo() {
    return this.http.get<LastLessonInfo>(`${this.serverUrl}/courses/last-lesson.json`);
  }
}
