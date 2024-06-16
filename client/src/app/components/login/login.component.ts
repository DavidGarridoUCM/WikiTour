import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  private usersService = inject(UsersService);
  public formLog : FormGroup;
  private router: Router = new Router;

    constructor(){
      this.formLog = new FormGroup({
        nick: new FormControl<string>('', Validators.required),
        password: new FormControl<string>('', Validators.required)
      })
    }

    onSubmit() {
      this.usersService.login(this.formLog.value).subscribe(
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
