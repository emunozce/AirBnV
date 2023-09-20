import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getFirestore, getDoc, doc, Firestore, CollectionReference, collection, getDocs } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  db:Firestore = getFirestore();
  usuariosCol:CollectionReference = collection(this.db, 'usuarios');
  constructor() {

  }

  async getUsuario(uidUsuario:string){
    let ref = doc(this.usuariosCol, uidUsuario);
    let usuario = await getDoc(ref);
    return usuario.data();
  }

}
