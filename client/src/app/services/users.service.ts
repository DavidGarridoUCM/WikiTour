import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, tap, throwError } from 'rxjs';
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
    this.urlBase = "http://localhost:3800/user";
   }

  registro(formVal: any) : Observable<any>{
      return this.httpClient.post<any>(this.urlBase, formVal);
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
              throwError(() => errorMessage);
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
          this.setToken(this.token);
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
        this.identity = JSON.parse(id);
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

  setIdentity(formVal : any){
    if(typeof window !== 'undefined'){
      localStorage.setItem('Identity', formVal);
    }
  }

  isLogged(){
    const tok = this.getToken();
    if(tok == null){
      return false;
    }
      const payload = JSON.parse(atob(tok.split('.')[1]));
      const exp = payload.exp * 1000;
      if(Date.now() < exp){
        return true;
      }
      else{
        localStorage.clear();
        return false;
      }
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

  setToken(token: any){
    localStorage.setItem('token', token);
  }

  getUser(id: any) : Observable<any>{
    return this.httpClient.get<any>(this.urlBase + '/' + id);
  }

  follow(idSeguidor: any, idSeguido: any)  : Observable<any> {
    //ver si hacen falta headers
    const headers = new HttpHeaders({'Content-Type' : 'application/json'});
    const body = JSON.stringify({idSeguidor: idSeguidor, idSeguido : idSeguido});
    return this.httpClient.post<any>(this.urlBase + '/foll', body, {headers: headers});
  }

  unfollow(idSeguidor: any, idSeguido: any)  : Observable<any> {
    //ver si hacen falta headers
    const headers = new HttpHeaders({'Content-Type' : 'application/json'});
    const body = JSON.stringify({idSeguidor: idSeguidor, idSeguido : idSeguido});
    return this.httpClient.post<any>(this.urlBase + '/unfoll', body, {headers: headers});
  }

  isFollowed(idSeguidor: any, idSeguido: any) : Observable<any> {
    const headers = new HttpHeaders({'Content-Type' : 'application/json'});
    const body = JSON.stringify({idSeguidor: idSeguidor, idSeguido : idSeguido});
    return this.httpClient.post<any>(this.urlBase + '/folled', body, {headers: headers});
  }

  getUsers(n : string) : Observable<any>{
    return this.httpClient.get<any>('http://localhost:3800/users/' + n);
  }

  updateUser(id: any, formVal: any) : Observable<any>{
    return this.httpClient.post<any>(this.urlBase + '/upd/' + id, formVal);
  }
}
