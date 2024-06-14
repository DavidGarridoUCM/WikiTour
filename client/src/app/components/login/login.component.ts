import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  public identity: any;
  public token : any;
  public status : any;
  
  

    constructor(){
      this.formLog = new FormGroup({
        nick: new FormControl<string>('', Validators.required),
        password: new FormControl<string>('', Validators.required)
      })
    }

    onSubmit() {
      this.usersService.login(this.formLog.value).subscribe(
        { next: response => {
            this.identity = response;
            console.log(this.identity);
            if (!this.identity || !this.identity._id) {
              this.status = 'error';
            }
            else {
              this.status = 'succes';
              //Meter los datos del usuario al localStorage
              localStorage.setItem('Identity', JSON.stringify(this.identity));
              //GetToken
              this.getToken();
            }
          },
          error: error => {
            var errorMessage = <any>error;
            console.log(errorMessage);

            if (errorMessage != null) {
              this.status = 'error';
            }
          }
        } 
      );
      
    }

    private getToken(){
      this.formLog.addControl('gettoken', new FormControl<boolean>(true));
      this.usersService.login(this.formLog.value).subscribe(
        { next: response => {
            this.token = response;
            console.log(this.token);
            if (!this.token) {
              this.status = 'error';
            }
            else {
              this.status = 'succes';
              //Meter el token al localStorage
              localStorage.setItem('token', JSON.stringify(this.token));
            }
          },
          error: error => {
            var errorMessage = <any>error;
            console.log(errorMessage);

            if (errorMessage != null) {
              this.status = 'error';
            }
          }
        } 
      );
    }

}
