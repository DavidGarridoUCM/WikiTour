import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent{

    private router: Router = new Router;
    usersService = inject(UsersService);
    formReg : FormGroup;
    private StrongPasswordRegx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,}$/;

    constructor(){
      this.formReg = new FormGroup({
        nick: new FormControl<string>('', Validators.required),
        nombre: new FormControl<string>('', Validators.required),
        apellidos: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        password: new FormControl<string>('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]),
        termsYCond: new FormControl<string>('', [Validators.requiredTrue]),
      })
    }

    onSubmit() {
      if(this.formReg.invalid){
        this.formReg.markAllAsTouched();
      }
      else{
        this.usersService.registro(this.formReg.value).subscribe(
          {next: () => {
              this.login();
            },
          error: (err) => {
              console.log(err.errorMessage);
            }
          }
        );
      }
    }

    get passwordFormField() {
      return this.formReg.get('password');
    }

    login(){
      this.usersService.login(this.formReg.value).subscribe(
        {next: () => {
          this.logtoken();
        },
        error: (err) => {
          console.log(err.errorMessage);
        }
      }
      );
    }

    logtoken(){
      this.formReg.addControl('gettoken', new FormControl<boolean>(true));
      this.usersService.loginToken(this.formReg.value).subscribe(
      {next: () => {
          this.router.navigate(['']); 
        },
      error: (err) => {
        console.log(err.errorMessage);
        }
      });
    }

}
