import {
  createSelector,
  createFeatureSelector,
  ActionReducer,
  Action,
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { getRouterSelectors, routerReducer, RouterReducerState } from '@ngrx/router-store';

import * as fromLayout from './layout.reducer';
import { inject, InjectionToken, isDevMode, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface State {
  [fromLayout.layoutFeatureKey]: fromLayout.State;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: RouterReducerState<any>;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      [fromLayout.layoutFeatureKey]: fromLayout.reducer,
      router: routerReducer,
    }),
  },
);

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  const isInBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  return (state, action) => {
    const result = reducer(state, action);
    if (!isInBrowser) {
      return result;
    }
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [logger] : [];

export const selectLayoutState = createFeatureSelector<fromLayout.State>(
  fromLayout.layoutFeatureKey,
);

export const selectShowSidenav = createSelector(selectLayoutState, fromLayout.selectShowSidenav);

export const { selectRouteData } = getRouterSelectors();
