import { importProvidersFrom } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { config } from './app/app.config';
import { AppComponent } from './app/core/containers';

const serverConfig = {
  providers: [...config.providers, importProvidersFrom(ServerModule)],
  appId: config.appId,
};

export default () => ({ app: AppComponent, serverConfig });
