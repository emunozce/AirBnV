import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Bioma, Casa, CasasService } from 'src/app/services/casas.service';
import { casasData } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})


export class BusquedaComponent implements OnInit {

  busqueda: string = "";
  casas: Casa[] = [];
  resultados: Casa[] = [];
  resultadosFiltrados: Casa[] = [];
  rangeValues: number[] = [];
  maxValue: number = 0;
  minValue: number = 0;
  maxPersonas: number = 0;
  minPersonas: number = 1;
  cantPersonas: number = 1;
  minDate: Date = new Date();
  tmpDate: Date = new Date();
  rangeDates!: Date[];
  ciudades: Bioma[] = [];
  ciudadSeleccionada: Bioma = { name: "", code: "" };
  infoCasas:casasData[]=[];
  modal:any = Swal;

  tags: string[] = [];
  tagsSeleccion: string[] = [];

  precios: any = document.getElementById("precios")!;

  constructor(private rutaActiva: ActivatedRoute, private casasService: CasasService) {
    this.casas = this.casasService.casas;
  }

  ngOnInit(): void {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.busqueda = params["termino"];
      if (this.busqueda == undefined) {
        this.busqueda = "";
      }
      this.resultados = [];
      this.ciudades = [];
      this.maxValue = Number.NEGATIVE_INFINITY;
      this.minValue = Number.POSITIVE_INFINITY;
      this.maxPersonas = Number.NEGATIVE_INFINITY;
      this.casas.forEach(element => {
        if (
          element.id.toString().includes(this.busqueda)
          || element.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
          || element.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())
          || element.tags.toString().toLowerCase().includes(this.busqueda.toLowerCase())
          || element.ubicacion.name.toLowerCase().includes(this.busqueda.toLowerCase())
        ) {
          this.resultados.push(element);
          if (element.precio > this.maxValue) this.maxValue = element.precio;
          if (element.precio < this.minValue) this.minValue = element.precio;
          if (element.maxPersonas > this.maxPersonas) this.maxPersonas = element.maxPersonas;
          element.tags.forEach(tag => {
            if (!this.tags.includes(tag)) {
              this.tags.push(tag);
            }
          });
          var band = true;
          this.ciudades.forEach(ciudad => {
            if (ciudad.code.includes(element.ubicacion.code)) {
              band = false;
            }
          });
          if (band) {
            this.ciudades.push(element.ubicacion);
          }
        }
      });
      if(this.minValue == this.maxValue){
        this.maxValue++;
      }
      this.rangeValues = [this.minValue, this.maxValue];
      this.resultadosFiltrados = this.resultados;
      /*if(localStorage.getItem("casasData") != null){
        this.infoCasas = JSON.parse(localStorage.getItem('casasData') || "{}");
      }else{
        this.infoCasas = [];
      }*/
      this.filtrarResultadosAsync().then((res)=>{
        this.resultadosFiltrados = res;
      }).catch((error)=>{
      });
    });
  }

  filtrarResultados():void{
    if(this.rangeDates!=undefined){
      this.modal.fire({
        title: 'Filtrando',
        html: 'Se estan filtrando los resultados',
        didOpen: ()=>{
          Swal.showLoading();
        },
        allowOutsideClick: false
      });
    }
    this.filtrarResultadosAsync().then((res)=>{
      this.resultadosFiltrados = res;
      if(this.rangeDates!=undefined) this.modal.close();
    }).catch((error)=>{
      if(this.rangeDates!=undefined) this.modal.close();
    });
  }


  async filtrarResultadosAsync(): Promise<Casa[]> {


    if (this.ciudadSeleccionada == null) this.ciudadSeleccionada = { name: "", code: "" };

    let resultadosFiltrados = [];

    for (let i = 0; i < this.resultados.length; i++) {

      const element = this.resultados[i];

      //Revisando precio y cantidad de personas
      if (element.precio < this.rangeValues[0] ||
        element.precio > this.rangeValues[1] ||
        element.maxPersonas < this.cantPersonas) {
        continue;
      }

      //Revisando biomas
      if (this.ciudadSeleccionada.code != "") {
        if (this.ciudadSeleccionada.code != element.ubicacion.code) continue;
      }

      //Revisando tags
      if (this.tagsSeleccion.length != 0) {
        var flag = false;
        this.tagsSeleccion.forEach(tagSel => {
          if (element.tags.includes(tagSel)) {
            flag = true;
          }
        });
        if (!flag) continue;
      }

      //Comprobando disponibilidad de fechas
      let band = false;
      if(this.rangeDates!=undefined){
        await this.casasService.consultaFechasCasa(element.id).then((fechas)=>{
          fechas.forEach((fecha) => {
            let fechaBusquedaInicio;
            let fechaBusquedaFinal;
            if(this.rangeDates[1] == null){
              fechaBusquedaInicio = new Date(this.rangeDates[0].toDateString());
              fechaBusquedaFinal = new Date(this.rangeDates[0].toDateString());
            }else{
              fechaBusquedaInicio = new Date(this.rangeDates[0].toDateString());
              fechaBusquedaFinal = new Date(this.rangeDates[1].toDateString());
            }
            if(fecha[1] >= fechaBusquedaInicio && fecha[0] <= fechaBusquedaFinal){
              band = true;
            }
          })
        });
      }
      if(band) continue;
      resultadosFiltrados.push(element);
    }
    return resultadosFiltrados;
  }

}

