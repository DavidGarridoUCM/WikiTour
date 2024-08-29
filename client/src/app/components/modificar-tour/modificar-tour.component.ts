import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { publi } from '../../models/publicacion';
import { PubliService } from '../../services/publi.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { user } from '../../models/user';

@Component({
  selector: 'app-modificar-tour',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './modificar-tour.component.html',
  styleUrl: './modificar-tour.component.scss'
})
export class ModificarTourComponent implements OnInit{
  
  public publi: publi = new publi('', {idUsu : '', nombre : '', apellidos : '',
    nick :'', fotoPerfil :''}, '', [], '', 0, [], [], -1, '', '', '', '');
  private publiService = inject(PubliService);
  private usersService = inject(UsersService);
  private router: Router = new Router;
  private id: any;
  private route = inject(ActivatedRoute);
  public etapas : Array<FormGroup> = [];
  public initialValue : Array<String> = [];
  public user: user = new user('', '', '', '', '', '', '', 0, '', 0, 0, 0);

  
  ngOnInit(): void {
    this.user = this.usersService.getIdentity();
    this.loadPage();
  }


  loadPage(){
    this.id = this.route.snapshot.params['id'];
    this.publiService.getPubli(this.id).subscribe(
      {next: (response) => {
        if(response != undefined){
          this.publi = response;
          for(const et of response.etapas){
            this.etapas.push(new FormGroup({
              titulo: new FormControl<string>(et.titulo, Validators.required),
              texto: new FormControl<string>(et.texto, Validators.required)
            }));
            this.initialValue.push(et.texto);
          }
        }
      },
      error: (e) => console.error(e)
      }
    );
  }

  sub() {
    let index = 0;
    for(const e of this.etapas){
      if(e.value.texto != this.initialValue[index]){
        this.publi.etapas[index].usuario = this.user.nick;
        this.publi.etapas[index].idUsu = this.user._id;
        this.publi.etapas[index].texto = e.value.texto;
      }
      index++;
    }
    this.publiService.updatePubli(this.publi.etapas, this.id).subscribe(
      {next: (response) => {
        if(response != undefined){
          this.router.navigate(['/publi/'+ this.id]); 
        }
      },
      error: (e) => console.error(e)
      }
    );
  }
}
