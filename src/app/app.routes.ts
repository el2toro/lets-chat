import { Routes } from '@angular/router';
import { MainPageComponent } from './features/pages/main-page/main-page.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './core/login/login.component';

export const routes: Routes = [
    { path: '', component: MainPageComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo: '' } // Handle unknown routes
];
