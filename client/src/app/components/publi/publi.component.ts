import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { publi } from '../../models/publicacion';
import { PubliService } from '../../services/publi.service';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-publi',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './publi.component.html',
  styleUrl: './publi.component.scss'
})
export class PubliComponent implements OnInit{

  private publiService = inject(PubliService);
  private userService = inject(UsersService);
  private id: any;
  public userId : string = '';
  private router: Router = new Router;
  private route = inject(ActivatedRoute);
  public like!: boolean;
  public comment : FormGroup;
  public etapasUsers : Array<String> = [];
  public namePubli : String = '';
  public publi: publi = new publi('', '', '', [], '', 0, [], [], -1, '', '', '');

  constructor() {
    this.comment = new FormGroup({
      texto: new FormControl<string>('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  isLike(likes: Array<String>){
    if(likes.includes(this.userId)){
      this.like = true;
      console.log('Si');
    }
    else{
      this.like = false;
      console.log('no');
    }
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
        location.reload();
      },
      error: (e) => console.error(e)
      }
    );
    
  }

  deleteLike(){
    this.publiService.deleteLike(this.id, this.userId).subscribe(
      {next: (response) => {
        location.reload();
      },
      error: (e) => console.error(e)
      }
    );
    
  }

  addComent(){
    //this.comment.addControl('usuario', new FormControl<string>(this.nick));
    console.log(this.comment.value);
    this.publiService.addComent(this.comment.value, this.id).subscribe(
      {next: (response) => {
        location.reload();
      },
      error: (e) => console.error(e)
      }
    );
  }

  modificarEtapas(){
    this.router.navigate(['modPubli/'+ this.id]);
  }
}
