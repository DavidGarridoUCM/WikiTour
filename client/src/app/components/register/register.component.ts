import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent{

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
      await this.usersService.registro(this.formReg.value);
    }

}
