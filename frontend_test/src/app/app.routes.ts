import { Routes } from '@angular/router';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

export const routes: Routes = [
    { path: 'register', component: RegisterPageComponent},
    { path: 'login', component: LoginPageComponent},
    { path: '', component: DashboardPageComponent}
];
