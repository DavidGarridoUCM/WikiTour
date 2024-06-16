import { Component, DoCheck, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, DoCheck{
    
    public nombre = "WIKITOUR";
    token: any;
    userService: UsersService = new UsersService;

    ngOnInit(): void {
      this.token = this.userService.getToken();
    }
    ngDoCheck(): void {
      this.token = this.userService.getToken();
    }
}
