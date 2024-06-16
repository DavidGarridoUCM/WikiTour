import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {path: "", component: AppComponent},
    {path: "register", component: RegisterComponent},
    {path: "login", component: LoginComponent}
];
