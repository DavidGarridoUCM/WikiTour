import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '../../models/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './datos-perfil.component.html',
  styleUrl: './datos-perfil.component.scss'
})
export class DatosPerfilComponent{

  private usersService = inject(UsersService);
  private router: Router = new Router;
  private route = inject(ActivatedRoute);
  public formChange : FormGroup;
  public user: user = new user('', '', '', '', '', '', '', 0, '', 0, 0, 0);

  constructor(){
    this.user = this.usersService.getIdentity();
    this.formChange = new FormGroup({
      nick: new FormControl<string>(this.user.nick, Validators.required),
      nombre: new FormControl<string>(this.user.nombre, Validators.required),
      apellidos: new FormControl<string>(this.user.apellidos, Validators.required),
      email: new FormControl<string>(this.user.email, [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required]),
      newPassword: new FormControl<string>('')
    })
  }

  async onSubmit() {
    //Llamar al actualizar en API, pero poner la comprobacion de que la contraseña sea la misma
    //console.log( this.formChange.value);
    await this.usersService.updateUser(this.user._id, this.formChange.value).subscribe(
      {next: (response) => {
        if(response != undefined){
          this.usersService.logout();
          this.router.navigate(['/login']);
        }
      },
      error: (e) => console.error(e)
      }
    );
    
   }

}
