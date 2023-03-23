import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config';
import { AppComponent } from './app/core/containers';

export const bootstrap = async () => {
  setTimeout(() => {
    bootstrapApplication(AppComponent, config).catch((err) => console.error(err));
  }, 0);
};

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
