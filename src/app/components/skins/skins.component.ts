import { Component, OnInit } from '@angular/core';
import { ApiskinsService } from '../../services/apiskins.service';


@Component({
  selector: 'app-skins',
  templateUrl: './skins.component.html',
  styleUrls: ['./skins.component.css']
})
export class SkinsComponent implements OnInit{
  resultados!:any;
  /*usuarios:string[] = [
    "VEGETTA777",
    "Willyrex",
    "bysTaXx_x",
    "elrubius",
    "xFarganx",
    "ElRichMC",
    "Gerardo12002",
  ]*/
  constructor(private apiMinecraft:ApiskinsService){
  }
  ngOnInit(){
    this.recuperarDatos();
  }
  async recuperarDatos(){
    this.resultados = await this.apiMinecraft.retornar();
  }
}
