import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withFetch} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(
      routes,
      withComponentInputBinding(),  //  withComponentInputBinding()'i url'den gelen bilgiyi input'a atamak için ekledik),
      withRouterConfig({ paramsInheritanceStrategy: 'always',}) // Parent route'dan Child Route'a parametre geçirme
    ),
    provideClientHydration(),
    provideHttpClient(withFetch()), provideAnimationsAsync(),
  ]
};
