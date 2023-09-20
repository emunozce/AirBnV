import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Casa, CasasService } from 'src/app/services/casas.service';
import { casasData } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { Auth, getAuth } from '@angular/fire/auth';
import { SendmailService } from 'src/app/services/sendmail.service';
import { formatDate } from '@angular/common';
import { ConsultaService } from 'src/app/services/consulta.service';
import * as ics from 'ics';

@Component({
  selector: 'app-casa',
  templateUrl: './casa.component.html',
  styleUrls: ['./casa.component.css'],
})
export class CasaComponent implements OnInit, AfterViewInit {
  i:number[] = [];
  minDate: Date = new Date();
  tmpDate: Date = new Date();
  maxDate: Date = new Date(this.tmpDate.setMonth(this.tmpDate.getMonth() + 12));
  rangeDates: Date[] = [this.minDate, this.minDate];
  reserva!:FormGroup;
  casa: Casa = {id: 0,
    nombre: "",
    precio: 0,
    rutaImg: [""],
    carpetaImg: "",
    descripcion:"",
    categoria:"",
    maxPersonas: 0,
    tags: [],
    ubicacion: {name:"",code:""}
  };
  fechaActual = new Date();
  fecha:string = "";
  diasdesh:Date[]=[];
  modal:any = Swal;
  auth:Auth = getAuth();
  valor!:string;

  ///////////////////Geras mapa
  private mapa!:L.Map;
  private tiles!:any;
  ngAfterViewInit(): void {
    this.mapa = L.map('map',{
      center: [51.505, -0.09],
      zoom: 13
    });
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    this.tiles.addTo(this.mapa);
  }

  ///////////////////Fin Geras mapa

  constructor(private casaService:CasasService, private rutaActiva:ActivatedRoute, private sendmail:SendmailService, private consultasService:ConsultaService){
    this.casaService.casas.forEach(casita => {
      if(casita.nombre === this.rutaActiva.snapshot.params['casa']){
        this.casa = {
          id: casita.id,
          nombre: casita.nombre,
          precio: casita.precio,
          rutaImg: casita.rutaImg,
          carpetaImg: casita.carpetaImg,
          descripcion:casita.descripcion,
          categoria:casita.categoria,
          maxPersonas: casita.maxPersonas,
          tags: casita.tags,
          ubicacion: casita.ubicacion
        }
      }

    });
    this.actualizarFechasDisponibles();
  }

  actualizarFechasDisponibles():void{
    let infoCasas:casasData[];
    this.casaService.consultaFechasCasa(this.casa.id).then((fechas) =>{
      let fechasDeshabilitar: Date[] = [];
      fechas.forEach((rangoFechas)=>{
        let fechaInicio = new Date(rangoFechas[0]);
        let fechaFinal = new Date(rangoFechas[1]);
        let fechaAux = new Date(fechaInicio.toDateString());
        fechaFinal.setTime(fechaFinal.getTime() + (fechaInicio.getTime()- fechaAux.getTime() ));
        while(fechaInicio <= fechaFinal){
          fechasDeshabilitar.push(new Date(fechaInicio));
          fechaInicio.setDate(fechaInicio.getDate()+1);
        }
      });
      this.diasdesh = this.diasdesh.concat(fechasDeshabilitar);
    }).catch((error)=>{
    })
  }

  infoFechas(){
    Swal.fire({
      title: '¿Cómo seleccionar las fechas?',
      html: 'Primero da click en la fecha en la que quieres empezar a disfrutar la casa, una vez seleccionada en morado, da click en la fecha en la que cederas ese placer a otra persona. Se seleccionará un rango de fechas marcadas en morado indicando que todos esos días reservarás la casa ¡para ti y tus amigos! <br> <img src="assets/Img/Fechas.gif" class="img-fluid"></img>',
      icon: 'question',
      width: "90%"
    });
  }

  ngOnInit(){
    this.fecha = this.fechaActual.toLocaleString();
    this.casaService.casas.forEach(casita => {
      if(casita.nombre === this.rutaActiva.snapshot.params['casa']){
        this.casa = {
          id: casita.id,
          nombre: casita.nombre,
          precio: casita.precio,
          rutaImg: casita.rutaImg,
          carpetaImg:casita.carpetaImg,
          descripcion:casita.descripcion,
          categoria:casita.categoria,
          maxPersonas: casita.maxPersonas,
          tags: casita.tags,
          ubicacion: casita.ubicacion
        }
      }
    });
    this.reserva = new FormGroup({
      'fecha': new FormControl('',[Validators.required]),
      'CantidadPersona' : new FormControl('1',[Validators.required])
    });
    this.validadCiclo();

  }


  validadCiclo():void{
    for(let a = 1; a <= this.casa.maxPersonas; a++ ){
      this.i[a-1]=a-1;
    }
  }

  async registrarReserva():Promise<void>{
    this.modal.fire({
      title: 'Reservaciones',
      html: 'Se está guardando la reservación',
      didOpen: ()=>{
        Swal.showLoading();
      },
      allowOutsideClick: false
    });
    //Aqui se obtienen las fechas que selecciono el usuario
    if(this.auth.currentUser){
      let fechaSeleccionadaInicio:Date;
      let fechaSeleccionadaFinal:Date;
      if(this.reserva.value.fecha[1] == null){
        fechaSeleccionadaInicio = this.reserva.value.fecha[0];
        fechaSeleccionadaFinal = this.reserva.value.fecha[0];
      }else{
        fechaSeleccionadaInicio = this.reserva.value.fecha[0];
        fechaSeleccionadaFinal = this.reserva.value.fecha[1];
      }
      this.casaService.consultaFechasCasa(this.casa.id).then(async (fechas)=>{
        let band:boolean = false;
        fechas.forEach(apartado => {
          if(apartado[1] >= fechaSeleccionadaInicio && apartado[0] <= fechaSeleccionadaFinal){
            band = true;
          }
        });
        if(!band && this.auth.currentUser){
          await this.casaService.ingresarFechasCasas(
            this.casa.id,
            fechaSeleccionadaInicio,
            fechaSeleccionadaFinal,
            this.auth.currentUser.uid,
            this.reserva.value.CantidadPersona,
            this.casa.precio
          ).then((docRef)=>{
            var body:any = {
              docRef: docRef,
              casaId: this.casa.id,
              nombreCasa: this.casa.nombre
            }
            this.consultasService.alta("/getApartado",body).then((data:any) => {
              this.modal.close();
              //Gerar QR y mostrarlo en el Swal
              let date1:Date = new Date(data.fechaInicio);
              let date2:Date = new Date(data.fechaFinal);
              var evento:ics.EventAttributes = {
                title: data.resumen,
                description: this.casa.descripcion,
                location: data.resumen,
                start: [date1.getFullYear(), date1.getMonth()+1, date1.getDate()+1],
                end: [date2.getFullYear(), date2.getMonth()+1, date2.getDate()+1],
              };
              const { error, value } = ics.createEvent(evento);
              this.valor = value!;
              Swal.fire({
                title: 'Apartado Confirmado',
                html: `Se ha registrado su apartado :D`,
                icon: 'success'
              });

              this.actualizarFechasDisponibles();
              this.correo(fechaSeleccionadaInicio ,fechaSeleccionadaFinal);
            })
          }).catch((error)=>{
            Swal.fire('Error','Ha ocurrido un error' + error,'error');
          });
        }else{
          Swal.fire('Error','Ha ocurrido un error al verificar las fechas, revise que su seleccion este habilitada','error');
          this.actualizarFechasDisponibles();
        }
      }).catch((error)=>{
        Swal.fire('Error','Ha ocurrido un error' + error,'error');
      })
    }else{
      Swal.fire('Inicio Sesión','Debe iniciar sesión para registrar una reserva','error');
    }

  }

  verificarUsr():boolean{
    if(this.auth.currentUser) return true;
    return false;
  }
  correo(fechaInicio:Date,fechaFinal:Date) {
    let fechaInicioS = formatDate(fechaInicio,"dd-MM-yyyy","en-US");
    let fechaFinalS = formatDate(fechaFinal,"dd-MM-yyyy","en-US");
    let body = {
      casa:this.casa,
      usr:this.auth.currentUser,
      fechaInicio:fechaInicioS,
      fechaFinal:fechaFinalS
    }
    this.sendmail.alta(this.sendmail.urlBase+'/reserva',body);
  }

}

