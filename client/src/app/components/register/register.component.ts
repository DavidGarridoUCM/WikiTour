import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent{

    private router: Router = new Router;
    usersService = inject(UsersService);
    formReg : FormGroup;

    constructor(){
      this.formReg = new FormGroup({
        nick: new FormControl<string>('', Validators.required),
        nombre: new FormControl<string>('', Validators.required),
        apellidos: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        password: new FormControl<string>('', [Validators.required])
      })
    }

    async onSubmit() {
     await this.usersService.registro(this.formReg.value).subscribe(
      {next: () => {
        this.login();
      },
      error: (err) => {
        console.log(err.errorMessage);
      }
    }
     );
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
          this.router.navigate(['']); //Cuando haga el home que lleve a home o a timeline
        },
      error: (err) => {
        console.log(err.errorMessage);
        }
      });
    }

}
