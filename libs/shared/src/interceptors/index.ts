import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { TransferHttpCacheInterceptor } from './transfer_http';

export const httpInterceptorProviders = [
  ApplicationRef,
  TransferState,
  TransferHttpCacheInterceptor,
  { provide: HTTP_INTERCEPTORS, useClass: TransferHttpCacheInterceptor, multi: true },
];
