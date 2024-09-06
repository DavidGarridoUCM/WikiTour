import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { publi } from '../../models/publicacion';
import { PubliService } from '../../services/publi.service';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-publi',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './publi.component.html',
  styleUrl: './publi.component.scss'
})
export class PubliComponent implements OnInit{

  private publiService = inject(PubliService);
  private userService = inject(UsersService);
  private id: any;
  public userId : string = '';
  public nick : string = '';
  public nombre : string = '';
  public apellidos : string = '';
  public fotoPerfil : string = '';
  private router: Router = new Router;
  private route = inject(ActivatedRoute);
  public like!: boolean;
  public comment : FormGroup;
  public etapasUsers : Array<String> = [];
  public namePubli : String = '';
  public publi: publi = new publi('', {idUsu : '', nombre : '', apellidos : '',
    nick :'', fotoPerfil :''}, '', [], '', 0, [], [], -1, '', '', '', '');
  public url: string = 'http://localhost:3800/publi/fotoPortada/';

  constructor() {
    this.nick = this.userService.getIdentity().nick;
    this.userId = this.userService.getIdentity()._id;
    this.comment = new FormGroup({
      texto: new FormControl<string>('', Validators.required),
      idUsu: new FormControl<string>(this.userId),
      nick: new FormControl<string>(this.nick),
      
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  isLike(likes: Array<String>){
    if(likes.includes(this.userId)){
      this.like = true;
    }
    else{
      this.like = false;
    }
  }

  fecha() : string{
    return this.publi.fecha.slice(8, 10) + '/' + this.publi.fecha.slice(5, 7) + '/' + this.publi.fecha.slice(0, 4);
  }

  loadPage(){
    this.id = this.route.snapshot.params['id'];
    this.userId = this.userService.getIdentity()._id;
    this.getPubli(this.id);
  }

  getPubli(id: any){
    this.publiService.getPubli(id).subscribe(
      {next: (response) => {
        if(response != undefined){
          this.publi = response;
          this.isLike(response.likes);
        }
      },
      error: (e) => console.error(e)
      }
    );
  }

  addLike(){
    this.publiService.addLike(this.id, this.userId).subscribe(
      {next: (response) => {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
        this.router.navigate(['/publi/' + this.id])});
      },
      error: (e) => console.error(e)
      }
    );
    
  }

  deleteLike(){
    this.publiService.deleteLike(this.id, this.userId).subscribe(
      {next: (response) => {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
        this.router.navigate(['/publi/' + this.id])});
      },
      error: (e) => console.error(e)
      }
    );
    
  }

  addComent(){
    console.log(this.comment.value);
    this.publiService.addComent(this.comment.value, this.id).subscribe(
      {next: (response) => {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
          this.router.navigate(['/publi/' + this.id])});
      },
      error: (e) => console.error(e)
      }
    );
  }

  modificarEtapas(){
    this.router.navigate(['modPubli/'+ this.id]);
  }
}
