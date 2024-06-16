import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private urlBase : string; 
  public identity: any;
  public token: any;
  constructor() {
    this.urlBase = "http://localhost:3800/user"
   }

  registro(formVal: any){
      return firstValueFrom(
        this.httpClient.post<any>(this.urlBase, formVal)
      );
  }

  login(formVal: any): Observable<any>{
    return this.httpClient.post<any>(this.urlBase + '/login', formVal).pipe(
      tap(
        {next: response => {
            this.identity = response;
            console.log(this.identity);
            if (!this.identity || !this.identity._id) {
              console.log('Error en login');
            }
            else {
              //Meter los datos del usuario al localStorage
              localStorage.setItem('Identity', JSON.stringify(this.identity));
              console.log(JSON.stringify(formVal));
            }
          },
          error: error => {
            var errorMessage = <any>error;
            console.log(errorMessage);
            if (errorMessage != null) {
              console.log('Error en login');
            }
          }
        }
        
      )
    )
  }

  loginToken(formVal: any): Observable<any>{
    return this.httpClient.post<any>(this.urlBase + '/login', formVal).pipe(
      tap({ next: response => {
        this.token = response.token;
        console.log(this.token);
        if (!this.token) {
          console.log('Error en el login');
        }
        else {
          //Meter el token al localStorage
          localStorage.setItem('token', this.token);
        }
      },
      error: error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          console.log('Error en el login');
        }
      }
    }));
  }

  logout(){
    localStorage.removeItem('Identity');
    localStorage.removeItem('token');
  }

  getIdentity(){
    if(typeof window !== 'undefined'){
      let id = localStorage.getItem("Identity");
      if(id != undefined){
        this.identity = id;
      }
      else{
        this.identity = null;
      }
    }
    else{
      this.identity =  null;
    }
    return this.identity;
  }

  getToken(){
    if(typeof window !== 'undefined'){
      let tok = localStorage.getItem("token");
      if(tok != undefined){
        this.token = tok;
      }
      else{
        this.token = null;
      }
    }
    else{
      this.token =  null;
    }
    return this.token;
  }
}
