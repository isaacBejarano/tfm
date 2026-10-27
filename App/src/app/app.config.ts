import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';

import { httpResponseMessageInterceptor } from '@app/common/snackbar/http-response-message.interceptor';
import { authInterceptor } from '@auth/auth.interceptor';
import { loaderInterceptor } from '@common/loader/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loaderInterceptor, authInterceptor, httpResponseMessageInterceptor]),
    ),
  ],
};
