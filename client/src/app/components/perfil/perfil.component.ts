import { Component, DoCheck, OnDestroy, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { user } from '../../models/user';
import { PubliService } from '../../services/publi.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgArrayPipesModule } from 'ngx-pipes';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink, NgxPaginationModule, NgArrayPipesModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit{
    
    private usersService = inject(UsersService);
    private publiService = inject(PubliService);
    public p: number = 1;
    private router: Router = new Router;
    private route = inject(ActivatedRoute);
    public user: user = new user('', '', '', '', '', '', '', -1, '', 0, 0, 0);
    private id: any;
    private iden = this.usersService.getIdentity();
    public isFollow!: boolean;
    public toursList: Array<{_id:string, titulo:string, pais:string, ciudad:string, continente:string, foto:string}> = [];
    public seguidoresList: Array<user> = [];
    public seguidosList: Array<user> = [];
    public tours!: boolean;
    public seguidores!: boolean;
    public seguidos!: boolean;
    public url: string = 'http://localhost:3800/user/fotoPerfil/';
    public urlPub: string = 'http://localhost:3800/publi/fotoPortada/';

    
    
    ngOnInit(): void {
      this.loadPage();
    }

    loadPage(){
      this.id = this.route.snapshot.params['id'];
      this.getUser(this.id);
      if(this.id != this.iden._id){
        this.isFollowed();
      }
      this.getTours();
    }

    getUser(id: any){
      this.usersService.getUser(id).subscribe(
        {next: (response) => {
          this.user = response;
        },
        error: (e) => console.error(e)
        }
      );

    }

    miPerfil(): boolean{
      if(this.id == this.iden._id){
        return true;
      }
      else{
        return false;
      }
    }

    getTours(){
      this.seguidores = false;
      this.tours =  true;
      this.seguidos = false;
      this.seguidoresList = [];
      this.seguidosList = [];
      this.publiService.getPublisUser(this.id).subscribe(
      {next: (response) => {
        this.toursList = response;
      },
      error: (e) => console.error(e)
      });
    }

    getSeguidos(){
      this.seguidores = false;
      this.tours = false;
      this.seguidos = true;
      this.seguidoresList = [];
      this.toursList = [];
      this.usersService.getSeguidos(this.id).subscribe(
      {next: (response) => {
        this.seguidosList = response.seguidos;
      },
      error: (e) => console.error(e)
      });
    }

    getSeguidores(){
      this.seguidores = true;
      this.tours =  false;
      this.seguidos = false;
      this.seguidosList = [];
      this.toursList = [];
      this.usersService.getSeguidores(this.id).subscribe(
        {next: (response) => {
          this.seguidoresList = response.seguidores;
        },
        error: (e) => console.error(e)
        });
    }


    follow(){
      this.usersService.follow(this.iden._id, this.id).subscribe(
        {next: () => {
          this.loadPage();
          this.isFollow = true;
        },
        error: (e) => console.error(e.errorMessage)
        }
      );
    }

    unfollow(){
      this.usersService.unfollow(this.iden._id, this.id).subscribe(
        {next: () => {
          this.loadPage();
          this.isFollow = false;
        },
        error: (e) => console.error(e.errorMessage)
        }
      );
    }

    
    isFollowed(){
      this.usersService.isFollowed(this.iden._id, this.id).subscribe(
        { next: response => {
          if(response != undefined){
            this.isFollow = true;
          }
          else{
            this.isFollow = false;
          }
        },
        error: error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage != null) {
            console.log('Error');
          }
        }
      });
    }

    pageChanged(e:any){
      this.p = e;
    }

}

