import { Component, DoCheck, OnDestroy, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { user } from '../../models/user';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit{
    
    
    private usersService = inject(UsersService);
    private router: Router = new Router;
    private route = inject(ActivatedRoute);
    public user: user = new user('', '', '', '', '', '', '', -1, '', 0, 0, 0);
    private id: any;
    private iden = this.usersService.getIdentity();
    public isFollow!: boolean;

    
    
    ngOnInit(): void {
      this.loadPage();
    }

    loadPage(){
      this.id = this.route.snapshot.params['id'];
      this.getUser(this.id);
      this.isFollowed();
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

}

