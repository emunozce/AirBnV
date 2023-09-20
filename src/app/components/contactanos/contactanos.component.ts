import { Component, OnInit } from '@angular/core';
import { SendmailService } from 'src/app/services/sendmail.service';
import { Auth, getAuth } from '@angular/fire/auth';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent implements OnInit {
  constructor(private sendmail: SendmailService) { }

  auth: Auth = getAuth();
  nombre = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
  apellido = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
  correo = new FormControl('', [Validators.required, Validators.email]);
  sugerencia = new FormControl('', Validators.required);

  ngOnInit(): void {


  }
  EnviarCorreo() {
    if (this.verificarUsr()) {
      this.sendCorreo();
      Swal.fire('Gracias por sus comentarios', 'En la brevedad nos comunicaremos con usted', 'success');
    }
  }
  verificarUsr(): boolean {
    if (this.nombre && this.apellido && this.correo && this.sugerencia) return true;
    return false;
  }

  sendCorreo() {

    let body = {
      usr: this.nombre.value + " " + this.apellido.value,
      correo: this.correo.value,
      desarrollo: this.sugerencia.value
    }
    this.sendmail.alta(this.sendmail.urlBase +'/contacto', body);
  }
}
