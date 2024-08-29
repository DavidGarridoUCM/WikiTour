import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '../../models/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-datos-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './datos-perfil.component.html',
  styleUrl: './datos-perfil.component.scss'
})
export class DatosPerfilComponent {

  private usersService = inject(UsersService);
  private router: Router = new Router;
  private route = inject(ActivatedRoute);
  public formChange : FormGroup;
  public fotoPerfil!: File;
  public user: user = new user('', '', '', '', '', '', '', 0, '', 0, 0, 0);
  public match: boolean = true;
  private StrongPasswordRegx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,}$/;
  public formLog: FormGroup;
  public url: string = 'http://localhost:3800/user/fotoPerfil/';

  constructor(){
    this.user = this.usersService.getIdentity();
    this.formChange = new FormGroup({
      nombre: new FormControl<string>(this.user.nombre, Validators.required),
      apellidos: new FormControl<string>(this.user.apellidos, Validators.required),
      email: new FormControl<string>(this.user.email, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      password: new FormControl<string>('', Validators.required),
      newPassword: new FormControl<string>('', Validators.pattern(this.StrongPasswordRegx))
    })

    this.formLog = new FormGroup({
      nick: new FormControl<string>(''),
      password: new FormControl<string>('')
    });
  }

  fileChangeEvent(event:any){
    this.fotoPerfil = <File>event.target.files[0];
  }


  async onSubmit() {
    if(!this.formChange.valid){
      this.formChange.markAllAsTouched();
    }
    else{
      if(this.fotoPerfil){
        this.usersService.subirFotoPerfil(this.user._id, [], this.fotoPerfil, 'image').then((result: any) => {
          console.log(result);
          this.user.fotoPerfil = result.fotoPerfil;
          localStorage.setItem('identity', JSON.stringify(this.user));
        });
      }
      this.usersService.updateUser(this.user._id, this.formChange.value).subscribe(
       {next: (response) => {
          if(response != undefined){
            console.log(this.user.nick);
            this.formLog.controls['nick'].setValue(this.user.nick);
            if(this.formChange.value.newPassword != ''){
              this.formLog.controls['password'].setValue(this.formChange.value.newPassword);
            }
            else{
              this.formLog.controls['password'].setValue(this.formChange.value.password);
            }
            this.login();
            this.router.navigate(['/perfil/' + this.user._id]);
          }
        },
        error: (e) => {
          console.log(e);
          if(e.error.message == 'Not Match'){
            alert("La contraseña actual es incorrecta");
          }
        }
        }
      );
    }
   }

   login(){
    this.usersService.login(this.formLog.value).subscribe(
      {next: (response) => {
        if(response._id){
          this.logtoken();
        }
        else{
          alert(response.message);
        }
      },
      error: (err) => { 
        console.log(err.errorMessage);
      }
    }
    );
   }

   logtoken(){
    this.formLog.addControl('gettoken', new FormControl<boolean>(true));
    this.usersService.loginToken(this.formLog.value).subscribe(
    {next: () => {
        //this.router.navigate(['']); //Cuando haga el home que lleve a home o a timeline
      },
    error: (err) => {
      console.log(err.errorMessage);
      }
    });
  }

}
