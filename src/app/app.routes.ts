import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { FeaturesPlaceholderComponent } from './features/features-placeholder/features-placeholder.component';
import { SettingsPageComponent } from './features/settings/settings-page/settings-page.component';

import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  
  { 
    path: 'dashboard', 
    component: DashboardPageComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'features', 
    component: FeaturesPlaceholderComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'settings', 
    component: SettingsPageComponent, 
    canActivate: [authGuard] 
  },
];