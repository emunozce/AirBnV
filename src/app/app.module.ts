import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { CardsComponent } from './components/cards/cards.component';
import { CasaComponent } from './components/casa/casa.component';
import { CasasService } from './services/casas.service';
import { PrincipalComponent } from './components/principal/principal.component';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//ngPrime
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { AnimateModule } from 'primeng/animate';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ConocenosComponent } from './components/conocenos/conocenos.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { VideoPipe } from './video.pipe';
import { DudasComponent } from './components/dudas/dudas.component';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { SkinsComponent } from './components/skins/skins.component';

//Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { InversionesComponent } from './components/inversiones/inversiones.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SendmailService } from './services/sendmail.service';
import { ContactanosComponent } from './components/contactanos/contactanos.component';
import { OtrosComponent } from './components/otros/otros.component';

import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { MiembrosComponent } from './components/miembros/miembros.component';
import { IniciarComponent } from './components/iniciar/iniciar.component';
import { GraficasComponent } from './components/graficas/graficas.component';
import { UsuariosService } from './services/usuarios.service';
import { ConsultaService } from './services/consulta.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    PrincipalComponent,
    BusquedaComponent,
    CardsComponent,
    CasaComponent,
    ConocenosComponent,
    VideoPipe,
    DudasComponent,
    ReservacionesComponent,
    SkinsComponent,
    CatalogoComponent,
    InversionesComponent,
    ContactanosComponent,
    OtrosComponent,
    MiembrosComponent,
    IniciarComponent,
    GraficasComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    QRCodeModule,
    AppRoutingModule,
    SliderModule,
    CalendarModule,
    CommonModule,
    InputNumberModule,
    ChipModule,
    TagModule,
    AnimateModule,
    BrowserAnimationsModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    CasasService,
    ScreenTrackingService,
    UserTrackingService,
    SendmailService,
    UsuariosService,
    ConsultaService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
