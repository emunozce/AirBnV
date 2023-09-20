import { Component, OnInit } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { CasasService } from 'src/app/services/casas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css']
})
export class ReservacionesComponent implements OnInit{
  data!:any;
  informacion!:any;
  fechaActual!:Date;
  usuario!:any;
  auth:Auth = getAuth();
  constructor(private casasService:CasasService, private usuariosService:UsuariosService){

  }

  async ngOnInit() {
    await this.obtenerReservaciones();
    this.fechaActual = new Date();
  }

  async obtenerReservaciones(){
    if(this.auth.currentUser){
      let modal = Swal;
      modal.fire({
        title: 'Reservaciones',
        html: 'Se estan cargando las reservaciones',
        didOpen: ()=>{
          Swal.showLoading();
        },
        allowOutsideClick: false
      });
      await this.casasService.consultaApartadosCasas().then(async (data)=>{
        if(this.auth.currentUser){
          this.data = data;
          await this.usuariosService.getUsuario(this.auth.currentUser.uid).then((usuario)=>{
            this.usuario = usuario;
          });
          modal.close();
        }

      });
    }
  }

  async eliminarReservacion(idCasa:number, idDocumento:string){
    Swal.fire({
      title: '¿Cancelar la reservación?',
      text: 'Si cancelas la reservación otras personas podrán tomar las fechas',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, canelar',
      cancelButtonText: 'Cancelar procedimiento'
    }).then(async (resultado)=>{
      if(resultado.isConfirmed){
        let modal = Swal;
        modal.fire({
          title: 'Reservaciones',
          html: 'Se esta dando de baja la reservación',
          didOpen: ()=>{
            Swal.showLoading();
          },
          allowOutsideClick: false
        });
        await this.casasService.darBajaFecha(idCasa.toString(), idDocumento).then(()=>{
          modal.close();
          Swal.fire('Reservaciones', 'Se ha cancelado correctamente la reservación', 'success')
          .then(async ()=>{
            await this.obtenerReservaciones();
          });
        });
      }
    });

  }

  fechaMayor(fechaInicio:string):boolean{
    var fechaRevisar:Date = new Date(fechaInicio);
    this.fechaActual = new Date();
    if(fechaRevisar >= this.fechaActual){
      return false;
    }
    return true;
  }

  fechaMayorInfo(){
    Swal.fire('Reservaciones', 'Ya paso la fecha de inicio de esta reservación, cualquier aclaracion comunicarse directamente a nuestro contacto.', 'info');
  }

  otroUsuarioInfo(usuario:any){
    if(usuario){
      Swal.fire('Reservaciones',
      `La reservación debe ser cancelada por el usuario al que le pertenece <br> Contacto: <br> ${usuario.nombre} <br> ${usuario.email} <br> ${usuario.telefono}`,
      'info');
    }else{
      Swal.fire('Reservaciones', 'La cita debe ser cancelada por el usuario al que le pertenece', 'info');
    }
  }

  currentUserAdmin(){
    if(this.usuario && this.usuario.admin!=undefined && this.usuario.admin){
      return true;
    }
    return false;
  }

  verificarDatos():boolean{
    if(this.data == null){
      return false;
    }
    return true;
  }
}
