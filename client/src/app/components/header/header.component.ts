import { Component, DoCheck, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { user } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { NgArrayPipesModule } from 'ngx-pipes';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule, NgArrayPipesModule],
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
    searching : boolean = false;

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
    
}
