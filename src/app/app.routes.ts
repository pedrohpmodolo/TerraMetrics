import { Routes } from '@angular/router';
import { GlobeComponent } from './components/globe/globe';
import { CompareComponent } from './pages/compare/compare';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', component: GlobeComponent },
  { path: 'compare', component: CompareComponent },
  
  // --- NEW ROUTES ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
