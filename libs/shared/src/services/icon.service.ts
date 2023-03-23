import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/* @TODO Inject Icons via app */
export enum Icons {
  Config = 'config',
  Cerrar = 'cerrar',
  Check = 'check',
  Suite = 'suite',
  Next = 'next',
  Play = 'play',
  ShuffleOne = 'shuffle-one',
  Eyes = 'eyes',
}

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);
  protected serverUrl = '';

  registerIcons(): void {
    this.loadIcons(Object.values(Icons), `${this.serverUrl}/assets/icons`);
  }

  private loadIcons(iconKeys: string[], iconUrl: string): void {
    iconKeys.forEach((key) => {
      this.matIconRegistry.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconUrl}/${key}.svg`),
      );
    });
  }
}
