import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "terrametrics-12e6a", appId: "1:212953607226:web:bfd6ddb75615b7f6fbd903", storageBucket: "terrametrics-12e6a.firebasestorage.app", apiKey: "AIzaSyCa8wja3O5CY-behADtxs5dEEFQmftSeUo", authDomain: "terrametrics-12e6a.firebaseapp.com", messagingSenderId: "212953607226", measurementId: "G-GMR75EQ01K" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    provideHttpClient()
  ]
};
