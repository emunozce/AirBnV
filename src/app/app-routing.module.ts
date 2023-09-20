import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { CasaComponent } from './components/casa/casa.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ConocenosComponent } from './components/conocenos/conocenos.component';
import { DudasComponent } from './components/dudas/dudas.component';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { SkinsComponent } from './components/skins/skins.component';
import { ComoUsarComponent } from './components/como-usar/como-usar.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { InversionesComponent } from './components/inversiones/inversiones.component';
import { ContactanosComponent } from './components/contactanos/contactanos.component';
import { OtrosComponent } from './components/otros/otros.component';
import { MiembrosComponent } from './components/miembros/miembros.component';
import { IniciarComponent } from './components/iniciar/iniciar.component';
import { GraficasComponent } from './components/graficas/graficas.component';

const routes: Routes = [
  { path: 'busqueda/:termino', component: BusquedaComponent },
  { path: 'busqueda', component: BusquedaComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'casa/:casa', component: CasaComponent },
  { path: 'inversiones', component: InversionesComponent },
  { path: 'conocenos', component: ConocenosComponent },
  { path: 'dudas', component: DudasComponent },
  { path: 'reservaciones', component: ReservacionesComponent },
  { path: 'skins', component: SkinsComponent },
  { path: 'home', component: PrincipalComponent },
  { path: 'comoUsar', component: ComoUsarComponent },
  { path: 'otro', component: OtrosComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'contactanos', component: ContactanosComponent },
  { path: 'miembros', component: MiembrosComponent },
  { path: 'graficas', component: GraficasComponent },
  { path: 'iniciar', component: IniciarComponent },
  { path: '', component: PrincipalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
