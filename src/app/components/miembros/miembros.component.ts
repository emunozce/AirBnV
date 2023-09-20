import { Component, OnInit } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  getFirestore,
  getDocs,
} from '@angular/fire/firestore';
import { ConsultaService } from 'src/app/services/consulta.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.component.html',
  styleUrls: ['./miembros.component.css'],
})

export class MiembrosComponent implements OnInit {
  usuarios!:any;
  usuario!:any;
  auth!:Auth;
  constructor(private consultaServicio:ConsultaService, private usuariosService:UsuariosService) {}
  async ngOnInit(){
    this.auth = getAuth();
    if(this.auth.currentUser){
      await this.usuariosService.getUsuario(this.auth.currentUser.uid).then((usuario)=>{
        this.usuario = usuario;
      });
    }
    this.consultaServicio.getJSON('/miembros').then((miembros) => {
      this.usuarios = miembros;
    });
  }

  currentUserAdmin(){
    if(this.usuario && this.usuario.admin!=undefined && this.usuario.admin){
      return true;
    }
    return false;
  }


}
