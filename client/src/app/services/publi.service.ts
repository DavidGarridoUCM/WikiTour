import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { publi } from '../models/publicacion';

@Injectable({
  providedIn: 'root'
})
export class PubliService {

  private httpClient = inject(HttpClient);
  private urlBase : string;
  private publi!: publi;

  constructor() {
    this.urlBase = "http://localhost:3800/publi";
  }

  createPubli(formVal: any) : Observable<any>{
    let body = JSON.parse(formVal);
   return this.httpClient.post<any>(this.urlBase, body);
  }

  getPubli(id:any) : Observable<any>{
    return this.httpClient.get<any>(this.urlBase + '/' + id);
  }

  updatePubli(etapas : any, id: any) : Observable<any>{
    return this.httpClient.post<any>(this.urlBase + '/upd/' + id, etapas);
  }

  getPublisUser(idUsu : string) : Observable<any>{
    return this.httpClient.get<any>(this.urlBase + 'sUser/' + idUsu);
  }

  getPublis(search : string) : Observable<any>{
    return this.httpClient.get<any>(this.urlBase + 's' + '/' + search);
  }

  lastPublis() : Observable<any>{
    return this.httpClient.get<any>(this.urlBase + 's');
  }

  addComent(formVal : any, id: any): Observable<any> {
    return this.httpClient.post<any>(this.urlBase + '/comm/' + id, formVal);
  }

  addLike(id : any, userId: any) : Observable<any>{
    const body = JSON.stringify({userId: userId});
    const headers = new HttpHeaders({'Content-Type' : 'application/json'});
    console.log(body);
    return this.httpClient.post<any>(this.urlBase + '/like/' + id, body,  {headers: headers});
  }

  deleteLike(id: any, userId : any) : Observable<any>{
    const body = JSON.stringify({userId: userId});
    const headers = new HttpHeaders({'Content-Type' : 'application/json'});
    return this.httpClient.post<any>(this.urlBase + '/dislike/' + id, body, {headers: headers});
  }

  getPublisFoll(id: any) : Observable<any>{
    return this.httpClient.get<any>(this.urlBase + 's-follows/' + id);
  }

  subirFotos(id: string, params: Array<string>, file: File, name: string){

		return new Promise((resolve, reject) =>{
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			formData.append(name, file, file.name);

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if (xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', this.urlBase + '-uploadImage/' + id, true);
			xhr.send(formData);
		});
	}


}
