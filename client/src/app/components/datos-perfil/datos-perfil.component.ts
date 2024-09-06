import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '../../models/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { PubliService } from '../../services/publi.service';

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
  public borrarFoto: boolean = false;

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

  deleteFoto(){
    this.borrarFoto = true;
    this.user.fotoPerfil = '';
  }


  async onSubmit() {
    if(!this.formChange.valid){
      this.formChange.markAllAsTouched();
    }
    else{
      if(this.fotoPerfil){
        if(this.user.fotoPerfil != null || this.user.fotoPerfil != '' || this.user.fotoPerfil != 'null'){
          this.usersService.deleteFotoPerfil(this.user._id).subscribe(
            { next: (response) => {
              
            },
            error: (error) => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                console.log('Error');
              }
            }
          });
        }
        this.usersService.subirFotoPerfil(this.user._id, [], this.fotoPerfil, 'image').then((result: any) => {
          this.user.fotoPerfil = result.fotoPerfil;
          localStorage.setItem('Identity', JSON.stringify(this.user));
        });
      }
      else if(this.borrarFoto == true){
        this.usersService.deleteFotoPerfil(this.user._id).subscribe(
          { next: (response) => {
            localStorage.setItem('Identity', JSON.stringify(this.user));
          },
          error: (error) => {
            var errorMessage = <any>error;
            if (errorMessage != null) {
              console.log('Error');
            }
          }
        });
      }
      this.usersService.updateUser(this.user._id, this.formChange.value).subscribe(
       {next: (response) => {
          if(response != undefined){
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
      },
    error: (err) => {
      console.log(err.errorMessage);
      }
    });
  }

}
