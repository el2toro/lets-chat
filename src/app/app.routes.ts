import { Routes } from '@angular/router';
import { MainPageComponent } from './features/pages/main-page/main-page.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupComponent } from './core/signup/signup.component';

export const routes: Routes = [
    { path: '', component: MainPageComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginPageComponent},
    { path: 'signup', component: SignupComponent},
    { path: '**', redirectTo: '' } // Handle unknown routes
];
