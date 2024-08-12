import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgArrayPipesModule } from 'ngx-pipes';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule, NgArrayPipesModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
    
    
    private usersService = inject(UsersService);
    public users : Array<{_id : string, nick: string, fotoPerfil: string}>  = [];
    public _id : string = '';
    public p: number = 1;
    public nick = '';

    ngOnInit(): void {
          this._id = this.usersService.getIdentity()._id;
    }

    lista(): void {
      let wordSearch = this.nick;
    setTimeout(() => {
        if (wordSearch == this.nick) {
          if(this.nick.length > 0){
            this.getUsers(this.nick);
          }
          else if(this.nick.length == 0){
            this.users = [];
          }
        }
    }, 700);
    }

    getUsers(n : string) : void {
      this.usersService.getUsers(n).subscribe(
        {
          next: (response) => {
            if(response != undefined){
              this.users = response; 
              console.log(response);
            }
          },
          error: (e) => console.error(e)
        }
      )
    }

    pageChanged(e:any){
      this.p = e;
    }
}
