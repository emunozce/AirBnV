import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  urlBase:string = "https://apifinal-cvwcbtm6xa-uc.a.run.app";
   constructor(public httpClient: HttpClient) {}

   getJSON(url: string) {
     return this.httpClient.get(this.urlBase+url).toPromise();
   }
   alta(url: string, body: any) {
    return this.httpClient.post(this.urlBase+url, body).toPromise();
  }

}
