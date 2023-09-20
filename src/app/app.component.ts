import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Accessibility } from 'accessibility/dist/main';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'AirbnV';
  nombreUsr!:string|null;
  //Busqueda
  constructor(private primengConfig: PrimeNGConfig){

  }
  ngOnInit(){
    //PrimeNG
    this.primengConfig.ripple = true;
    this.initAccessibility();
  }

  initAccessibility():void{
    var opt = new Accessibility({
      modules: {
        increaseText: true,
        decreaseText: true,
        invertColors: true,
        increaseTextSpacing: true,
        decreaseTextSpacing: true,
        grayHues: true,
        underlineLinks: false,
        bigCursor: false,
        readingGuide: false,
        textToSpeech: true,
        speechToText: false,
        disableAnimations: false
      },
      language: {
        textToSpeechLang: 'es-MX',
        speechToTextLang: 'es-MX'
      },
      labels:{
        resetTitle: 'Reiniciar',
        closeTitle: 'Cerrar',
        menuTitle: 'Accesibilidad',
        increaseText: 'Aumentar tamaño de letra',
        decreaseText: 'Disminuir tamaño de letra',
        increaseTextSpacing: 'Aumentar espaciado horizontal',
        decreaseTextSpacing: 'Disinuir espaciado horizontal',
        increaseLineHeight: 'Aumentar espaciado vertical',
        decreaseLineHeight: 'Disminuir espaciado vertical',
        invertColors: 'Invertir colores',
        grayHues: 'Escala de Grises',
        underlineLinks: 'Subrayar links',
        bigCursor: ' Cursor más grande',
        readingGuide: 'Guía de lectura',
        textToSpeech:'Texto al habla',
        speechToText: 'Dictado de texto',
        disableAnimations: 'Desabilitar animaciones',
        screenReader: 'Lector de pantalla'
      }
    });
    opt.disableUnsupportedModules();

  }
  mandarUsr(usr:string|null){
      this.nombreUsr=usr;
  }
}

