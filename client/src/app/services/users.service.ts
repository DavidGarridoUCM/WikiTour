import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { user } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private urlBase : string; 
  public identity: any;
  public token: any;
  public user : user | undefined
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

  isLogged(){
    const tok = this.getToken();
    if(tok == null){
      return false;
    }
      const payload = JSON.parse(atob(tok.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
  }

  getToken(){
    if(typeof window !== 'undefined'){
      let tok = localStorage.getItem("token");
      if(tok != undefined){
        return tok;
      }
      else{
        return null;
      }
    }
    else{
      return null;
    }
  }

  getUser(id: any) : Observable<any>{
    return this.httpClient.get<any>(this.urlBase + '/' + id);
  }

  follow(idSeguidor: any, idSeguido: any)  : Observable<any> {
    const body = {"idSeguidor": idSeguidor, "idSeguido" : idSeguido};
    return this.httpClient.post<any>(this.urlBase + '/foll', body);
  }
}
