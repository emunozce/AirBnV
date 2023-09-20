import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Casa, CasasService } from 'src/app/services/casas.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'boot-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'scale(0.6)',
        }),
        animate(500, style({
          opacity: 1,
          transform: 'scale(1)',
        })),
      ]),
      transition('* => void', [
        animate(500, style({
          opacity: 0,
          transform: 'scale(0.6)'
        }))
      ])
    ])
  ]
})
export class PrincipalComponent implements OnInit {

  num = Math.floor(Math.random() * 5);
  propiedad = ["Habitación Sur 309", "Casa Norte 404", "Edificio Sur 101", "Apartamento Este 777", "Terreno Oeste 911"];
  valor: string = this.propiedad[this.num];

  link: string="AMWvGHsD4rA";
  casas:Casa [];
  mostrar:Casa [] = [];
  constructor (public casasService: CasasService){
     this.casas = casasService.casas;
  }
  ngOnInit(): void {
    let numeros:number[] = []
    while(numeros.length < 5){
      let numero = Math.floor(Math.random()*(this.casas.length));
      if(numeros.indexOf(numero) == -1){
        numeros.push(numero);
      }
    }
    for(let i=0;i<5;i++){
      this.mostrar[i]=this.casas[numeros[i]];
    }
  }
}
