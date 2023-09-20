import { Component } from '@angular/core';
import { Casa, CasasService } from 'src/app/services/casas.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  casas:Casa [];
  constructor (public casasService: CasasService){
     this.casas = casasService.casas;
  }
}
