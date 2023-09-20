import { Injectable } from '@angular/core';
import { getFirestore, getDocs, getDoc, Firestore, collection, query, where, setDoc, CollectionReference, doc, addDoc, collectionGroup, deleteDoc } from '@angular/fire/firestore';
import * as numeral from 'numeral';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CasasService {

  urlBase:string = "https://apifinal-cvwcbtm6xa-uc.a.run.app";
  //urlBase:string = "http://localhost:3000";
  db:Firestore = getFirestore();
  collection:CollectionReference = collection(this.db,'casas');

  constructor(private httpClient:HttpClient) { }

  getJSON(url: string) {
    return this.httpClient.get(this.urlBase+url).toPromise();
  }

  async consultaFechasCasa(idCasa:number){
    let referencia = collection(this.collection, idCasa.toString(), 'apartado');
    let apartados = await getDocs(referencia);
    let fechas:[Date[]] = [[]];
    apartados.forEach((apartado:any) => {
      let data = apartado.data();
      let rangoFecha = [new Date(data.fechaInicio), new Date(data.fechaFinal)];
      fechas.push(rangoFecha);
    })
    fechas.shift();
    return fechas;
  }

  async consultarFechasCasas(){
    let referencia = query(collectionGroup(this.db, 'apartado'));
    let apartados = await getDocs(referencia);
    let fechas:FechasCasas[] = [];
    apartados.forEach((apartado)=>{
      let data = apartado.data();
      let idCasa = Number.parseInt(apartado.ref.path.split('/')[1]);
      fechas.push({
        fechaFinal: new Date(data["fechaFinal"]),
        fechaInicio: new Date(data["fechaInicio"]),
        idCasa: idCasa
      });
    })
    return fechas;
  }

  async consultaApartadosCasas(){
    var reservaciones:any[] = [];
    await this.getJSON('/apartados').then((apartados:any) => {
      reservaciones = apartados;
    });
    return reservaciones;
  }

  async ingresarFechasCasas(idCasa:number, fechaInicio:Date, fechaFinal:Date, uid:string, cantPersonas:number, precio:number){
    let data = {
      idCasa: idCasa,
      fechaInicio: fechaInicio.toISOString(),
      fechaFinal: fechaFinal.toISOString(),
      uid: uid,
      cantPersonas: cantPersonas,
      precio: precio
    }
    let referencia = collection(this.collection, idCasa.toString(), 'apartado');
    let docRef = await addDoc(referencia, data);
    return docRef.id;
  }

  async darBajaFecha(idCasa:string,idDocumento:string){
    let ref = doc(this.collection, idCasa, 'apartado', idDocumento);
    await deleteDoc(ref);
  }

  casas:Casa [] = [
    { id: 1,
      nombre: "Arenisca",
      precio: 1000,
      rutaImg:[ "casa1.jpg",
                "casa1.1.jpg",
                "casa1.2.jpg",
                "casa1.3.jpg"],
      carpetaImg:"casa1",
      descripcion:"Esta casa esta hecha con arenisca sobre un lago en medio del desierto, es genial para estar con tus amigos y nadar cuando el calor sea extremo",
      categoria: "Casa impresionante",
      maxPersonas: 5,
      tags: ["Rural", "Desierto", "Lago"],
      ubicacion: {name: "Desierto", code: "des"}
     },
     {
      id: 2,
      nombre: "Flotante",
      precio: 30000,
      rutaImg:[ "casa2.jpg",
                "casa2.1.jpg",
                "casa2.2.jpg",
                "casa2.3.jpg",
                "casa2.4.jpg",
                "casa2.5.jpg"],
      carpetaImg:"casa2",
      descripcion: "¡Esta casa esta en las alturas! Disfruta de aventras con tus amigos en lo alto de las montañas y descubran hermosos paisajes en el bosque",
      categoria: "Casa alturas",
      maxPersonas: 10,
      tags: ["Montaña","Alturas"],
      ubicacion: {name: "Bosque", code: "bos"}
     },
     {
      id: 3,
      nombre: "Castillo",
      precio: 20000,
      rutaImg:[ "casa3.jpg",
                "casa3.1.jpg",
                "casa3.2.jpg",
                "casa3.3.jpg",
                "casa3.4.jpg"],
      carpetaImg:"casa3",
      descripcion: "Disfruta de momentos divertidos imaginando que son caballeros mediabales y luchan por la conquista del castillo",
      categoria: "Casa grande",
      maxPersonas: 3,
      tags: ["Mar","Playa","Castillo"],
      ubicacion: {name: "Bosque", code: "bos"}
     },
     {
      id: 4,
      nombre: "Vacacional",
      precio: 15000,
      rutaImg:[ "casa4.jpg",
                "casa4.1.jpg",
                "casa4.2.jpg",
                "casa4.3.jpg",
                "casa4.4.jpg",
                "casa4.5.jpg",
                "casa4.6.jpg",
                "casa4.7.jpg",],
      carpetaImg:"casa4",
      descripcion: "En esta casa disfrutaras de divertidas vacaciones con tus amigos, disfruta de su alberaca y amplios espacios así como el arte y hermosos detalles",
      categoria: "Casa grande",
      maxPersonas: 7,
      tags: ["Alberca","Libre","Ladrillo","Rural"],
      ubicacion: {name: "Bosque", code:"bos"}
     },
     {
      id: 5,
      nombre: "Apartamental",
      precio: 15000,
      rutaImg:[ "casa5.jpg",
                "casa5.1.jpg",
                "casa5.2.jpg",
                "casa5.3.jpg",],
      carpetaImg:"casa5",
      descripcion: "En esta casa podrás disfrutar de una gran vista al mar con sus grandes ventanales y a un lado un edificio de apartamentos para tus amigos",
      categoria: "Casa grande",
      maxPersonas: 7,
      tags: ["Alturas","Mar","Vista"],
      ubicacion: {name: "Mar", code:"mar"}
     },
     {
      id: 6,
      nombre: "Castillo en las Alturas",
      precio: 25000,
      rutaImg:[ "casa6.jpg",
                "casa6.1.jpg",
                "casa6.2.jpg",
                "casa6.3.jpg",
                "casa6.4.jpg",
                "casa6.5.jpg",],
      carpetaImg:"casa6",
      descripcion: "Disfruta como los dioses del olimpo en las alturas de esta casa diseñada por griegos, mientras pueden tener grandes fiestas como en aquellos tiempos",
      categoria: "Casa grande",
      maxPersonas: 3,
      tags: ["Alturas","Castillo","Olimpo"],
      ubicacion: {name: "Montaña", code: "mon"}
     },
     { id: 7,
      nombre: "Salvaje",
      precio:100000,
      rutaImg:[ "casa7.jpg",
                "casa7.1.jpg",
                "casa7.2.jpg",
                "casa7.3.jpg",
                "casa7.4.jpg",
                "casa7.5.jpg",],
      carpetaImg:"casa7",
      descripcion:"En esta casa disfrutaras la selva y un ambiente nevado a la vez, teniendo amplios espacios para sembrar e investigar la selva",
      categoria: "Casa grande",
      maxPersonas: 5,
      tags: ["Nevado","Olimpo", "Libre","Alberca"],
      ubicacion: {name: "Bosque", code: "bos"}
     },
     { id: 8,
      nombre: "Moderno",
      precio:10000,
      rutaImg:[ "casa8.jpg",
                "casa8.1.jpg",
                "casa8.2.jpg",
                "casa8.3.jpg",
                "casa8.4.jpg",],
      carpetaImg:"casa8",
      descripcion:"En esta casa",
      categoria: "Casa grande",
      maxPersonas: 5,
      tags: ["Moderno","Lago", "Libre"],
      ubicacion: {name: "Bosque", code: "bos"}
     },
     { id: 9,
      nombre: "Simple",
      precio:5000,
      rutaImg:[ "casa9.jpg",
                "casa9.1.jpg",
                "casa9.2.jpg",
                "casa9.3.jpg",],
      carpetaImg:"casa9",
      descripcion:"En esta casa disfrutaras las alturas de las montañas con la simplicidad de su diseño conservador",
      categoria: "Casa grande",
      maxPersonas: 5,
      tags: ["Rural","Aturas", "Libre"],
      ubicacion: {name: "Montaña", code: "mon"}
     },
     { id: 10,
      nombre: "End",
      precio:15000,
      rutaImg:[ "casa10.jpg",
                "casa10.1.jpg",
                "casa10.2.jpg",
                "casa10.3.jpg"],
      carpetaImg:"casa10",
      descripcion:"Esta casa sin ambueblar es ideal para llevar tus pertenencias básicas y empezar una aventura con todos tus amigos, tiene materiales de última generación traídos del End, ¡disfrutalá!",
      categoria: "Casa grande",
      maxPersonas: 5,
      tags: ["Planicie","Mueble", "Libre"],
      ubicacion: {name: "Planicie", code: "pla"}
     },
  ];
}
export interface Casa {
  id:number;
  nombre:string;
  precio:number;
  rutaImg:string[];
  carpetaImg:string;
  descripcion:string;
  categoria:string;
  maxPersonas:number;
  tags: string[];
  ubicacion: Bioma;
}

export interface Bioma {
  name: string;
  code: string;
}

export interface FechasCasas{
  fechaInicio: Date;
  fechaFinal: Date;
  idCasa: number;
}
