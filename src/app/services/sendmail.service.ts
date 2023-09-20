import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {
  urlBase:string = "https://apifinal-cvwcbtm6xa-uc.a.run.app";
  constructor(private httpClient: HttpClient) {

  }
  alta(url: string, body: any) {
    return this.httpClient.post(url, body).toPromise();
  }
}
