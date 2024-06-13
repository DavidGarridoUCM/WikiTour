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
  usersService = inject(UsersService);
  formLog : FormGroup;
  //gettoken : boolean;

    constructor(){
      this.formLog = new FormGroup({
        nick: new FormControl<string>('', Validators.required),
        password: new FormControl<string>('', Validators.required)
      })
    }

    async onSubmit() {
      this.formLog.addControl('gettoken', new FormControl<boolean>(true));
      const response = await this.usersService.login(this.formLog.value);
      console.log(response);
    }

}
