import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { ApplicationRef, inject, Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { StateKey, TransferState, makeStateKey } from '@angular/platform-browser';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Observable, of as observableOf } from 'rxjs';
import { defaultIfEmpty, first, tap } from 'rxjs/operators';

type ResponseType = HttpRequest<unknown>['responseType'];

export interface TransferHttpResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any | null;
  headers?: Record<string, string[]>;
  status?: number;
  statusText?: string;
  url?: string;
  responseType?: ResponseType;
}

function getHeadersMap(headers: HttpHeaders): Record<string, string[]> {
  const headersMap: Record<string, string[]> = {};
  for (const key of headers.keys()) {
    const values = headers.getAll(key);
    if (values !== null) {
      headersMap[key] = values;
    }
  }

  return headersMap;
}

@Injectable()
export class TransferHttpCacheInterceptor implements HttpInterceptor {
  protected readonly isInBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private isCacheActive = true;
  private serverUrl?: string;
  private makeCacheKey(
    method: string,
    url: string,
    params: HttpParams,
    responseType: ResponseType,
  ): StateKey<TransferHttpResponse> {
    const encodedParams = params
      .keys()
      .sort()
      .map((k) => `${k}=${params.getAll(k)}`)
      .join('&');

    const key = (method === 'GET' ? 'G.' : 'H.') + responseType + '.' + url + '?' + encodedParams;

    return makeStateKey<TransferHttpResponse>(key);
  }

  constructor(
    appRef: ApplicationRef,
    private transferState: TransferState,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Optional() @Inject(REQUEST) private request?: any,
  ) {
    this.serverUrl = this.isInBrowser
      ? ''
      : `${this.request.protocol}://${this.request.get('host')}`;

    appRef.isStable
      .pipe(
        first((isStable) => isStable),
        defaultIfEmpty(false),
      )
      .subscribe(() => {
        this.isCacheActive = false;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isCacheActive || (req.method !== 'GET' && req.method !== 'HEAD')) {
      return next.handle(req);
    }

    const storeKey = this.makeCacheKey(req.method, req.url, req.params, req.responseType);

    if (this.transferState.hasKey(storeKey)) {
      // Request found in cache. Respond using it.
      const response = this.transferState.get(storeKey, {});
      let body: ArrayBuffer | Blob | string | undefined = response.body;

      switch (response.responseType) {
        case 'arraybuffer':
          body = new TextEncoder().encode(response.body).buffer;
          break;
        case 'blob':
          body = new Blob([response.body]);
          break;
      }

      return observableOf(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new HttpResponse<any>({
          body,
          headers: new HttpHeaders(response.headers),
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        }),
      );
    } else {
      // Request not found in cache. Make the request and cache it.

      const newUrl = `${this.serverUrl}${req.url}`;
      const httpEvent = next.handle(this.serverUrl && req.url ? req.clone({ url: newUrl }) : req);

      return httpEvent.pipe(
        tap((event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            this.transferState.set<TransferHttpResponse>(storeKey, {
              body: event.body,
              headers: getHeadersMap(event.headers),
              status: event.status,
              statusText: event.statusText,
              url: event.url || '',
              responseType: req.responseType,
            });
          }
        }),
      );
    }
  }
}
