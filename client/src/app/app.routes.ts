import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DatosPerfilComponent } from './components/datos-perfil/datos-perfil.component';
import { CreatePubliComponent } from './components/create-publi/create-publi.component';
import { PubliComponent } from './components/publi/publi.component';
import { ModificarTourComponent } from './components/modificar-tour/modificar-tour.component';
import { ShowPublisComponent } from './components/show-publis/show-publis.component';

export const routes: Routes = [
    //{path: "", component: AppComponent},
    {path: "register", component: RegisterComponent, canActivate: [AuthenticatedGuard]},
    {path: "login", component: LoginComponent, canActivate: [AuthenticatedGuard]},
    {path: "perfil/:id", component: PerfilComponent, canActivate: [AuthGuard]},
    {path: "perfilData", component: DatosPerfilComponent, canActivate: [AuthGuard]},
    {path: "crearPubli", component: CreatePubliComponent, canActivate: [AuthGuard]},
    {path: "publi/:id", component: PubliComponent, canActivate: [AuthGuard]},
    {path: "modPubli/:id", component: ModificarTourComponent, canActivate: [AuthGuard]},
    {path: "publis", component: ShowPublisComponent, canActivate: [AuthGuard]}
];
