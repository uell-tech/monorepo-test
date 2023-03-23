import { createAction } from '@ngrx/store';

export const openSidenav = createAction('[Layout] Open Sidenav');
export const closeSidenav = createAction('[Layout] Close Sidenav');
export const idleTimeout = createAction('[User] Idle Timeout');
