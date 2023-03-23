import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { fromEvent, merge, of, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { isPlatformBrowser } from '@angular/common';
import * as fromRoot from './app.reducer';
import { idleTimeout } from './app.actions';

@Injectable()
export class AppEffects {
  protected readonly isInBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly titleService = inject(Title);

  updateTitle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        concatLatestFrom(() => this.store.select(fromRoot.selectRouteData)),
        map(([, data]) => `Tarjetas - ${data['title']}`),
        tap((title) => this.titleService.setTitle(title)),
      ),
    {
      dispatch: false,
    },
  );

  idle$ = !this.isInBrowser
    ? of()
    : createEffect(() =>
        merge(
          fromEvent(document, 'click'),
          fromEvent(document, 'keydown'),
          fromEvent(document, 'mousemove'),
        ).pipe(
          // 5 minute inactivity timeout
          switchMap(() => timer(5 * 60 * 1000)),
          tap(() => {
            alert('Inactividad de 5 minutos');
          }),
          map(() => idleTimeout()),
        ),
      );
}
