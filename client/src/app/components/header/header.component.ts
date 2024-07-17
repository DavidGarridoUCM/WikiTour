import { Component, DoCheck, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { user } from '../../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, DoCheck{
    
    public nombre = "WIKITOUR";
    token: any;
    private router: Router = new Router;
    userService: UsersService = new UsersService;
    identity: any;
    id: string = "";
    search$ = new BehaviorSubject<string>('');
    //listUsers = user[];

    ngOnInit(): void {
      this.token = this.userService.getToken();
      this.identity = this.userService.getIdentity();
    }
    ngDoCheck(): void {
      this.token = this.userService.getToken();
      this.identity = this.userService.getIdentity();
    }

    logout(){
      this.userService.logout();
      this.router.navigate(['/login']);
    }
    
    //terminar busqueda de usuarios
    /*filterList(){
      this.search$.pipe(
        debounceTime(400), distinctUntilChanged(), 
        map(term => {
          return this.listUsers.filter(item => item.toLowerCase().indexOf(term.toLowerCase()) >= 0);
        })
      );
    }*/
}
