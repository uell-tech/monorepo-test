//Temp server
import 'zone.js/node';

import { StaticProvider } from '@angular/core';
import { INITIAL_CONFIG, renderApplication, ɵSERVER_CONTEXT } from '@angular/platform-server';
import { ɵInlineCriticalCssProcessor as InlineCriticalCssProcessor } from '@nguniversal/common/tools';
import * as fs from 'fs';
import { dirname, resolve } from 'path';
import { URL } from 'url';

export interface CommonRenderOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bootstrap?: any;
  providers?: StaticProvider[];
  url?: string;
  document?: string;
  documentFilePath?: string;
  inlineCriticalCss?: boolean;
  publicPath?: string;
}

export class CommonEngine {
  private readonly templateCache = new Map<string, string>();
  private readonly inlineCriticalCssProcessor: InlineCriticalCssProcessor;
  private readonly pageExists = new Map<string, boolean>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private bootstrap?: any, private providers: StaticProvider[] = []) {
    this.inlineCriticalCssProcessor = new InlineCriticalCssProcessor({
      minify: true,
    });
  }

  async render(opts: CommonRenderOptions): Promise<string> {
    const { inlineCriticalCss = true } = opts;

    if (opts.publicPath && opts.documentFilePath && opts.url !== undefined) {
      const url = new URL(opts.url);
      // Remove leading forward slash.
      const pathname = url.pathname.substring(1);
      const pagePath = resolve(opts.publicPath, pathname, 'index.html');

      if (pagePath !== resolve(opts.documentFilePath)) {
        // View path doesn't match with prerender path.
        let pageExists = this.pageExists.get(pagePath);
        if (pageExists === undefined) {
          pageExists = await exists(pagePath);
          this.pageExists.set(pagePath, pageExists);
        }

        if (pageExists) {
          return fs.promises.readFile(pagePath, 'utf-8');
        }
      }
    }

    const extraProviders: StaticProvider[] = [
      { provide: ɵSERVER_CONTEXT, useValue: 'ssr' },
      ...(opts.providers ?? []),
      ...this.providers,
    ];

    let doc = opts.document;
    if (!doc && opts.documentFilePath) {
      doc = await this.getDocument(opts.documentFilePath);
    }

    if (doc) {
      extraProviders.push({
        provide: INITIAL_CONFIG,
        useValue: {
          document: inlineCriticalCss
            ? doc.replace(
                / media="print" onload="this\.media='all'"><noscript><link .+?><\/noscript>/g,
                '>',
              )
            : doc,
          url: opts.url,
        },
      });
    }

    const moduleOrFactory = this.bootstrap || opts.bootstrap;
    if (!moduleOrFactory) {
      throw new Error('A module or bootstrap option must be provided.');
    }

    const { app, serverConfig } = await moduleOrFactory();
    //return doc as string;
    const html = await renderApplication(app, {
      platformProviders: extraProviders,
      appId: 'serverApp',
      providers: serverConfig.providers,
    });

    if (inlineCriticalCss) {
      return html;
    }

    const { content, errors, warnings } = await this.inlineCriticalCssProcessor.process(html, {
      outputPath: opts.publicPath ?? (opts.documentFilePath ? dirname(opts.documentFilePath) : ''),
    });

    // eslint-disable-next-line no-console
    warnings?.forEach((m) => console.warn(m));
    // eslint-disable-next-line no-console
    errors?.forEach((m) => console.error(m));

    return content;
  }

  private async getDocument(filePath: string): Promise<string> {
    let doc = this.templateCache.get(filePath);
    if (!doc) {
      doc = await fs.promises.readFile(filePath, 'utf-8');
      this.templateCache.set(filePath, doc);
    }
    return doc;
  }
}

async function exists(path: fs.PathLike): Promise<boolean> {
  try {
    await fs.promises.access(path, fs.constants.F_OK);

    return true;
  } catch {
    return false;
  }
}

import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

export interface NgSetupOptions
  extends Pick<CommonRenderOptions, 'providers' | 'publicPath' | 'inlineCriticalCss'> {
  bootstrap: NonNullable<CommonRenderOptions['bootstrap']>;
}

export interface RenderOptions extends CommonRenderOptions {
  req: Request;
  res?: Response;
}

export function ngExpressEngine(setupOptions: Readonly<NgSetupOptions>) {
  const engine = new CommonEngine(setupOptions.bootstrap, setupOptions.providers);

  return function (
    filePath: string,
    options: object,
    callback: (err?: Error | null, html?: string) => void,
  ) {
    try {
      const renderOptions = { ...options } as RenderOptions;
      if (!setupOptions.bootstrap && !renderOptions.bootstrap) {
        throw new Error('You must pass in a NgModule to be bootstrapped');
      }

      const { req } = renderOptions;
      const res = renderOptions.res ?? req.res;

      renderOptions.url =
        renderOptions.url ?? `${req.protocol}://${req.get('host') || ''}${req.baseUrl}${req.url}`;
      renderOptions.documentFilePath = renderOptions.documentFilePath ?? filePath;
      renderOptions.providers = [...(renderOptions.providers ?? []), getReqResProviders(req, res)];
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      renderOptions.publicPath =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderOptions.publicPath ?? setupOptions.publicPath ?? (options as any).settings?.views;
      renderOptions.inlineCriticalCss =
        renderOptions.inlineCriticalCss ?? setupOptions.inlineCriticalCss;

      engine
        .render(renderOptions)
        .then((html) => callback(null, html))
        .catch(callback);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      callback(err);
    }
  };
}

function getReqResProviders(req: Request, res?: Response): StaticProvider[] {
  const providers: StaticProvider[] = [
    {
      provide: REQUEST,
      useValue: req,
    },
  ];
  if (res) {
    providers.push({
      provide: RESPONSE,
      useValue: res,
    });
  }

  return providers;
}

import { APP_BASE_HREF } from '@angular/common';

import express, { Request, Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/apps/emat-portal');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap,
      inlineCriticalCss: false,
    }),
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    }),
  );

  // All regular routes use the Universal engine
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.get('*', (req: any, res: any) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run() {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
