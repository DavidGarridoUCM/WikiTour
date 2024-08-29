import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PubliService } from '../../services/publi.service';
import { user } from '../../models/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-create-publi',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-publi.component.html',
  styleUrl: './create-publi.component.scss'
})
export class CreatePubliComponent {
  private publiService = inject(PubliService);
  private usersService = inject(UsersService);
  private router: Router = new Router;
  private route = inject(ActivatedRoute);
  public fotosTour : any;
  public formCreatePubli : FormGroup;
  public etapas : Array<FormGroup> = [];
  public user: user = new user('', '', '', '', '', '', '', 0, '', 0, 0, 0);

  constructor(){
    this.user = this.usersService.getIdentity();
    this.formCreatePubli = new FormGroup({
      titulo: new FormControl<string>('', Validators.required),
      ciudad: new FormControl<string>('', [Validators.required]),
      pais: new FormControl<string>('', [Validators.required]),
      continente: new FormControl<string>('')
    });

    this.etapas.push(new FormGroup({
      titulo: new FormControl<string>('', Validators.required),
      texto: new FormControl<string>('', Validators.required)
    }));
  }
  
  
  addEtapa() {
    this.etapas.push(new FormGroup({
      titulo: new FormControl<string>('', Validators.required),
      texto: new FormControl<string>('', Validators.required)
    }))
  }

  etapasValids() : boolean{
    var r : boolean = true
    for(const e of this.etapas){
      if(!e.valid){
        r = false;
      }
    }
    return r;
  }

  deleteEtapa() {
    if(this.etapas.length > 1){
      this.etapas.pop();
    }
  }

  fileChangeEvent(event:any){
    this.fotosTour = <File>event.target.files[0];
  }

  async onSubmit() {
    let usuario = '"usuario": { "idUsu": "' + this.user._id + '", "nombre": "' + this.user.nombre + 
    '", "apellidos": "' + this.user.apellidos + '", "nick": "' + this.user.nick + '", "fotoPerfil": "' + this.user.fotoPerfil + '"}'
    console.log(this.formCreatePubli.value);
    let b = JSON.stringify(this.formCreatePubli.value);
    let body = b.slice(0, -1);
    let etap = ', "etapas": [';
    let index = 1;
    for(const et of this.etapas){
      et.addControl('usuario', new FormControl<string>(this.user.nick));
      et.addControl('idUsu', new FormControl<string>(this.user._id));
      etap += JSON.stringify(et.value) + ',';
      index++;
    }
    let etapas = etap.slice(0, -1);
    body += etapas + "]," + usuario + "}";
    await this.publiService.createPubli(body).subscribe(
      {next: (response) => {
        console.log(response);
        if(this.fotosTour != null){
          this.publiService.subirFotos(response._id, [], this.fotosTour, 'image');
        }
        this.router.navigate(['/publi/' + response._id]);
      },
      error: (err) => {
        console.log(err.errorMessage);
      }
    }
    );
  }


}





