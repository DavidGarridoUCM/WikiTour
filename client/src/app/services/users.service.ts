import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private urlBase : string; 
  public token: any;
  constructor(private router: Router) {
    this.urlBase = "http://localhost:3800/user"
   }

  registro(formVal: any){
      return firstValueFrom(
        this.httpClient.post<any>("http://localhost:3800/user", formVal)
      );
  }

  login(formVal: any): Observable<any>{
    return this.httpClient.post<any>("http://localhost:3800/login", formVal);
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  //getIdentity(){
    
  //}

  getToken(){
    let tok = localStorage.getItem("token");
    if(tok != undefined){
      this.token = tok;
    }
    else{
      this.token = null;
    }

    return this.token;
  }

  //private setToken()
}
