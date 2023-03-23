import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { selectCoursesEntities } from './store';

@Injectable({
  providedIn: 'root',
})
export class CourseExistsGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  waitForStoreToLoad(): Observable<boolean> {
    return of(true).pipe(
      filter((loaded) => loaded),
      take(1),
    );
  }

  hasCourse(id: string): Observable<boolean> {
    return this.store.select(selectCoursesEntities).pipe(
      map((entities) => !!entities[id]),
      map((exists) => {
        if (exists) return true;
        this.router.navigate(['/']);
        return false;
      }),
      take(1),
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.waitForStoreToLoad().pipe(
      switchMap(() => this.hasCourse(route.params['courseId'])),
    );
  }
}
