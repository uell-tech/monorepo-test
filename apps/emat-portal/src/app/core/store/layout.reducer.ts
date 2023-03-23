import { createReducer, on } from '@ngrx/store';
import { closeSidenav, openSidenav } from './app.actions';

export const layoutFeatureKey = 'layout';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

export const reducer = createReducer(
  initialState,
  on(closeSidenav, () => ({ showSidenav: false })),
  on(openSidenav, () => ({ showSidenav: true })),
);

export const selectShowSidenav = (state: State) => state.showSidenav;
