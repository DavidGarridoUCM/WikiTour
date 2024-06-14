import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private urlBase : string; 
  constructor() {
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

  //private setToken()
}
