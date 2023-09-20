import { Component } from '@angular/core';
import { ConsultaService } from 'src/app/services/consulta.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-inversiones',
  templateUrl: './inversiones.component.html',
  styleUrls: ['./inversiones.component.css']
})
export class InversionesComponent {
  inversionesData: any[] = [];
  modal:any = Swal;
  constructor(private consultasService: ConsultaService) {}

  ngOnInit() {
    this.getInversionesData();
  }

  getInversionesData() {
    this.modal.fire({
      title: 'Inversionistas',
      html: 'Se estan cargando nuestros inversionistas',
      didOpen: ()=>{
        Swal.showLoading();
      },
      allowOutsideClick: false
    });
    this.consultasService.getJSON('/inversiones').then(
      (data: any) => {
        this.inversionesData = data.members;
        this.modal.close();
      },
      (error: any) => {
        console.error('Error al obtener los datos de inversión:', error);
        this.modal.close();
      }
    );
  }
}
