import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { user } from '../../models/user';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit{
    
    private usersService = inject(UsersService);
    private router: Router = new Router;
    private route = inject(ActivatedRoute);
    public user: user = new user('', '', '', '', '', '', '', 0, '', 0, 0, 0);
    private id: any;

    
    
    
    ngOnInit(): void {
      this.loadPage();
    }

    loadPage(){
      this.id = this.route.snapshot.params['id'];
      this.getUser(this.id);
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

    follow(){
      this.usersService.follow(this.usersService.getIdentity()._id, this.id).subscribe(
        {next: () => {
          this.loadPage();
        },
        error: (e) => console.error(e.errorMessage)
        }
      );
    }


}

