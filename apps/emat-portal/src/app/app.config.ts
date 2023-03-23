import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import appRoutes from './app.routes';
import { AppEffects, metaReducers } from './core/store';
import { ROOT_REDUCERS } from './core/store/app.reducer';
import { httpInterceptorProviders } from '@emat/shared/interceptors';

const appId = 'serverApp';

export const config = {
  providers: [
    importProvidersFrom(BrowserModule.withServerTransition({ appId })),
    httpInterceptorProviders,
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(ROOT_REDUCERS, {
      metaReducers,
    }),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    isDevMode()
      ? provideStoreDevtools({
          maxAge: 25,
          name: 'Cards App',
        })
      : [],
    provideRouterStore(),
    provideEffects(AppEffects),
    importProvidersFrom(BrowserAnimationsModule),
  ],
  appId,
};
