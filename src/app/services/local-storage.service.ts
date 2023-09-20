import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
}
export interface casasData{
  usr:string;
  id:number;
  personas:number;
  precio:number;
  fechaInicio:string;
  fechaFinal:string;
  horaInicio:string;
  horaFinal:string;
}

export interface user{
  uid: string;
  nombre: string;
  email: string;
  gender: string;
  telefono: string;
  usrName: string;
}
