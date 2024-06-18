import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
    //{path: "", component: AppComponent},
    {path: "register", component: RegisterComponent, canActivate: [AuthenticatedGuard]},
    {path: "login", component: LoginComponent, canActivate: [AuthenticatedGuard]},
    {path: "perfil/:id", component: PerfilComponent, canActivate: [AuthGuard]}
];
