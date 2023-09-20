import { Component, EventEmitter, Output } from '@angular/core';
import { Auth, getAuth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  termino:HTMLInputElement | undefined;
  busqueda:string = "";
  usuarioAdmin:boolean = false;
  auth:Auth = getAuth();
  @Output() nombreUsr = new EventEmitter<string|null>();
  constructor(private usuariosService:UsuariosService){

  }

  cerrarSesion(){
    signOut(this.auth).then(()=>{
      Swal.fire(
        'Cerrar sesión',
        'Se ha cerrado la sesión',
        'success'
      );
    }).catch((error)=>{
      Swal.fire(
        'Cerrar sesión',
        'Ha ocurrido un error: ' + error,
        'error'
      );
    });
  }

  ngOnInit(): void {
    //Busqueda
    this.initBusqueda();
    //manejo de usuarios
    this.initUserManage();

  }

  initBusqueda():void{
    this.termino = <HTMLInputElement> document.getElementById("termino")!;
    this.termino.addEventListener("keyup",() => {
      if(this.termino!=undefined){
        this.busqueda = this.termino.value;

      }else{
        this.busqueda = "";
      }
    });
  }

  initUserManage():void{
    let btnRegistro = document.getElementById("inicioSesion");
    let btnCerrar = document.getElementById("cerrarSesion");
    let btnReservas = document.getElementById("reservar");
    let btnGraficas = document.getElementById("graficas");
    onAuthStateChanged(this.auth, (user) => {
      if(user && btnRegistro && btnCerrar && btnReservas && this.auth.currentUser){
        btnRegistro.innerHTML = "Bienvenido, " + this.auth.currentUser?.displayName;
        //output
        if(this.auth.currentUser.displayName) this.nombreUsr.emit(this.auth.currentUser.displayName);
        btnRegistro.setAttribute("disabled", "true");
        btnCerrar.removeAttribute("disabled");
        btnReservas.removeAttribute("disabled");
        this.usuarioAdmin = false;
        if(this.auth.currentUser){
          this.usuariosService.getUsuario(this.auth.currentUser.uid).then((usuario:any) =>{
            if(usuario && usuario.admin){
              this.usuarioAdmin = true;
            }
          });
        }
      }else if(btnRegistro && btnCerrar && btnReservas){
        btnRegistro.innerHTML = '<i class="fa-solid fa-user"></i> Iniciar Sesión';
        btnRegistro.removeAttribute("disabled");
        btnCerrar.setAttribute("disabled", "true");
        btnReservas.setAttribute("disabled", "true");
        this.nombreUsr.emit(null);
        this.usuarioAdmin = false;
      }
    });
  }


}
