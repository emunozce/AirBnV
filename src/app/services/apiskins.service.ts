import { Injectable, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import {
  getFirestore,
  getDocs,
  Firestore,
  collection,
} from '@angular/fire/firestore';
import { user } from './local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class ApiskinsService {
  consulta!: any;
  db!: Firestore;
  q!: any;
  data!: any;

  constructor(private http: HttpClient) {}

  async retornar() {
    let usr: user[] = [];
    this.db = getFirestore();
    this.data = await getDocs(collection(this.db, 'usuarios'));
    this.data.forEach((element: any) => {
      usr.push(<user>element.data());
    });
    let resultados: any = [];
    usr.forEach((usuario) => {
      this.http
        .get('https://api.ashcon.app/mojang/v2/user/' + usuario.usrName)
        .subscribe(
          (result: any) => {
            resultados.push(result);
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('Client-side error');
            } else {
              console.log('Server-side error');
            }
          }
        );
    });
    return resultados;
  }
}
