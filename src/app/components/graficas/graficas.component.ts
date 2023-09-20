import { Component, OnInit } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { Firestore, collection, getFirestore, getDocs } from '@angular/fire/firestore';
import { Chart } from 'chart.js';
import { CasasService } from 'src/app/services/casas.service';
import { ConsultaService } from 'src/app/services/consulta.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {
  title = 'chartDemo';
  canva!: HTMLCanvasElement;
  genderChartCanvas!: HTMLCanvasElement;
  casas!: string[];
  data!: any;
  usuario!: any;
  auth!: Auth;
  generoData:any;

  constructor(
    private consultaService: ConsultaService,
    private casasService: CasasService,
    private usuariosService: UsuariosService
  ) {}

  currentUserAdmin() {
    if (this.usuario && this.usuario.admin != undefined && this.usuario.admin) {
      return true;
    }
    return false;
  }

  async ngOnInit() {
    this.auth = getAuth();
    if (this.auth.currentUser) {
      await this.usuariosService.getUsuario(this.auth.currentUser.uid).then((usuario) => {
        this.usuario = usuario;
      });
    }
    this.generarChart();
    this.generarGenderChart();
  }

  async generarChart() {
    await this.consultaService.getJSON('/masApartados').then((data) => {
      this.data = data;
    });
    var data: number[] = [];
    var labels: string[] = [];
    var colors: string[] = [];
    this.data.forEach((element: any) => {
      let obj = this.casasService.casas.find((obj) => {
        return obj.id === element.idCasa;
      });
      if (obj) {
        labels.push(obj.nombre + ' (' + obj.id + ')');
        data.push(element.cant);
        colors.push('#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6));
      }
    });
    this.canva = <HTMLCanvasElement>document.getElementById('myChart')!;
    var ctx = this.canva.getContext('2d');
    if (this.canva && ctx) {
      ctx.clearRect(0, 0, this.canva.width, this.canva.height);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Reservaciones',
              data: data,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          title: {
            text: 'Reservaciones por casas',
          },
        },
      });
    }
  }

  async generarGenderChart() {
    await this.consultaService.getJSON("/generos").then((data) => {
      this.generoData = data;
    });

    var data: number[] = [];
    var labels: string[] = [];
    var colors: string[] = [];
    this.generoData.forEach((element: any) => {
      labels.push(element.genero);
      data.push(element.cant);
      colors.push('#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6));
    });
    this.genderChartCanvas = <HTMLCanvasElement>document.getElementById('genderChart')!;
    var genderCtx = this.genderChartCanvas.getContext('2d');
    if (this.genderChartCanvas && genderCtx) {
      genderCtx.clearRect(0, 0, this.genderChartCanvas.width, this.genderChartCanvas.height);
      new Chart(genderCtx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              label: '',
              data: data,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          scales: {

          },
          title: {
            text: 'Género de usuarios',
          },
        },
      });
    }
  }
}
