import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, linkWithPhoneNumber, deleteUser, updateProfile } from '@angular/fire/auth';
import { doc, getFirestore, setDoc, deleteDoc, collection, getDocs } from '@angular/fire/firestore';
import { getDoc } from '@firebase/firestore';
import { user } from 'src/app/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isValidPhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})

export class RegistroComponent implements OnInit {

  datosUsuario!:user;

  usuario = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    usrName: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [
      Validators.required,
      this.PhoneNumberValidation()
    ]),
    passwd: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl('', Validators.required),
  });
  sesion = new FormGroup({
    usrNameLog: new FormControl('', [Validators.required]),
    passwdLog: new FormControl('', [Validators.required]),
  });
  phone = new FormGroup({
    numberphone: new FormControl('',[
      Validators.required,
      this.PhoneNumberValidation()
    ])
  });

  passwdConf = new FormControl('', Validators.required);
  fondo = 'linear-gradient(135deg, #71b7e6, #9b59b6)';

  auth:Auth = getAuth();
  appVerifier!:RecaptchaVerifier;
  appVerifierRegistro!:RecaptchaVerifier;

  constructor(private router: Router, private route:ActivatedRoute){
    this.auth.useDeviceLanguage();
  }

  ngOnInit(): void {
      this.appVerifier = new RecaptchaVerifier('inputIniciarwphone',{
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Recaptcha confirmado'
          });
          this.loginwphone();
        }
      }, this.auth);
      this.appVerifierRegistro =  new RecaptchaVerifier('inputRegistro',{
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Recaptcha confirmado'
          }).then(()=>{
            this.procesar();
          });
        }
      }, this.auth);
  }

  PhoneNumberValidation(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      let validNumber:boolean = false;
      try{
        validNumber = isValidPhoneNumber(control.value);
      }catch(e){}
      return validNumber ? null:{'wrongNumber':{value: control.value}};
    }
  }


  procesar(){
    if (document.getElementById('registro')?.classList.contains('habilitado')) {
      let email:string = this.usuario.value.email || "";
      let passwd: string = this.usuario.value.passwd || "";
      let phone: string = this.usuario.value.telefono || "";
      if((email || passwd) != ""){
        let button:HTMLInputElement = <HTMLInputElement>document.getElementById("inputRegistro");
        if(button){
          button.innerHTML = `
            <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
            Registrando...
          `;
          button.setAttribute("disabled","true");
        }
        createUserWithEmailAndPassword(this.auth, email, passwd)
          .then(async (userCredential)=>{
            const user = userCredential.user;
            const db = getFirestore();
            try{
              await setDoc(doc(db, 'usuarios', user.uid),{
                nombre: this.usuario.value.nombre,
                email: this.usuario.value.email,
                usrName: this.usuario.value.usrName,
                telefono: this.usuario.value.telefono,
                gender: this.usuario.value.gender,
              }).then(()=>{
                if(this.auth.currentUser){
                  linkWithPhoneNumber(this.auth.currentUser, phone, this.appVerifierRegistro)
                  .then((confirmResult)=>{
                    Swal.fire({
                      title: 'Confirma el código que recibiste por SMS',
                      html: `<input type="number" id="codigo" class="swal2-input" placeholder="Codigo de confirmación">`,
                      confirmButtonText: 'Confirmar',
                      focusConfirm: false,
                      preConfirm: () => {
                        const popup = Swal.getPopup();
                        if(popup){
                          let recupera = <HTMLInputElement> popup.querySelector('#codigo');
                          const login = recupera.value;
                          if (!login) {
                            Swal.showValidationMessage(`Introduce el código de confirmación`)
                          }
                          return { login: login }
                        }
                        return null;
                      }
                    }).then((result)=>{
                      confirmResult.confirm(result.value?.login || "").
                      then(()=>{
                        if(this.auth.currentUser)
                        updateProfile(this.auth.currentUser,{
                          displayName: this.usuario.value.nombre
                        });
                        Swal.fire(
                          'Registro',
                          'Se ha registrado correctamente, ' + this.usuario.value.nombre + '. Inice sesión.',
                          'success'
                        ).then(()=>{
                            this.auth.signOut();
                            this.clearForm();
                            this.reactivarBoton(button, "Registrar");
                          }
                        );
                      })
                      .catch((error)=>{
                        if(this.auth.currentUser){
                          deleteDoc(doc(db, 'usuarios', this.auth.currentUser.uid));
                          deleteUser(this.auth.currentUser);
                        }
                        Swal.fire(
                          'Registro',
                          'Ha ocurrido un error: ' + error.message,
                          'error').then(()=>{
                            this.reactivarBoton(button, "Registrar");
                          });
                      });
                    }).catch((error)=>{
                      if(this.auth.currentUser){
                        deleteDoc(doc(db, 'usuarios', this.auth.currentUser.uid));
                        deleteUser(this.auth.currentUser);
                      }
                      Swal.fire(
                        'Registro',
                        'Ha ocurrido un error: ' + error.message,
                        'error').then(()=>{
                          this.reactivarBoton(button, "Registrar");
                        });
                    });
                  })
                  .catch((error)=>{
                    if(this.auth.currentUser){
                      deleteDoc(doc(db, 'usuarios', this.auth.currentUser.uid));
                      deleteUser(this.auth.currentUser);
                    }
                    Swal.fire(
                      'Registro',
                      'Ha ocurrido un error: ' + error,
                      'error'
                    ).then(()=>{
                      this.reactivarBoton(button, "Registrar");
                    });
                  });
                }
              });
            }catch(error){
              if(this.auth.currentUser){
                deleteDoc(doc(db, 'usuarios', this.auth.currentUser.uid));
                deleteUser(this.auth.currentUser);
              }
              Swal.fire(
                'Registro',
                'Ha ocurrido un error: ' + error,
                'error'
              ).then(()=>{
                this.reactivarBoton(button, "Registrar");
              });
            }
          })
          .catch((error) => {
            Swal.fire(
              'Registro',
              'Ha ocurrido un error: ' + error.message,
              'error').then(()=>{
                this.reactivarBoton(button, "Registrar");
              });
          });
      }else{
        Swal.fire('Registro', 'Verifique que los datos estén completos', 'error');
      }
    } else {
      Swal.fire('Registro', 'Verifique que los datos estén completos', 'error');
    }
  }

  login(){
    if (document.getElementById('inicio')?.classList.contains('habilitado')) {
      let email:string = this.sesion.value.usrNameLog || "";
      let passwd: string = this.sesion.value.passwdLog || "";
      if((email && passwd) != ""){
        let button:HTMLInputElement = <HTMLInputElement>document.getElementById("inputIniciar");
        if(button){
          button.innerHTML = `
            <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
            Iniciando sesión...
          `;
          button.setAttribute("disabled","true");
        }
        signInWithEmailAndPassword(this.auth, email, passwd)
          .then(async (userCredential)=>{
            const user = userCredential.user;
            const db = getFirestore();
            try{
              await getDoc(doc(db, 'usuarios', user.uid))
              .then((docRef)=>{
                if(docRef.exists()){
                  let datos = docRef.data();
                  this.datosUsuario = {
                    uid: user.uid,
                    nombre: datos["nombre"],
                    email: datos["email"],
                    gender: datos["gender"],
                    telefono: datos["telefono"],
                    usrName: datos["usrName"]
                  }
                  Swal.fire(
                    'Inicio de sesión',
                    'Se ha iniciado correctamente, ' + this.auth.currentUser?.displayName,
                    'success'
                  ).then(()=>{
                      this.clearSesion();
                      this.reactivarBoton(button, 'Iniciar Sesión');
                      this.router.navigate(['catalogo']);
                    }
                  );
                }else{
                  Swal.fire(
                    'Inicio de sesión',
                    'No se ha encontrado el documento del usuario',
                    'error').then(()=>{
                      this.auth.signOut();
                      this.reactivarBoton(button, 'Iniciar Sesión');
                    });
                }
              });
            }catch(error){
              Swal.fire(
                'Inicio de sesión',
                'Ha ocurrido un error: ' + error,
                'error').then(()=>{
                  this.reactivarBoton(button, 'Iniciar Sesión');
                });
            }
          })
          .catch((error) => {
            Swal.fire(
              'Inicio de sesión',
              'Ha ocurrido un error: ' + error.message,
              'error').then(()=>{
                this.reactivarBoton(button, 'Iniciar Sesión');
              });
          });
      }else{
        Swal.fire('Inicio de sesión', 'Verifique que los datos estén completos', 'error');
      }

    }else {
      Swal.fire('Inicio de sesión', 'Verifique que los datos estén completos', 'error');
    }
  }

  loginwphone(){
    if (document.getElementById('iniciowphone')?.classList.contains('habilitado')) {
      let phone:string = this.phone.value.numberphone || "";
      if((phone) != ""){
        let button:HTMLInputElement = <HTMLInputElement>document.getElementById("inputIniciarwphone");
        if(button){
          button.innerHTML = `
            <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
            Iniciando sesión...
          `;
          button.setAttribute("disabled","true");
        }
        const db = getFirestore();
        let col = collection(db, 'usuarios');
        var band = false;
        getDocs(col).then((usuarios)=>{
          usuarios.forEach((usr)=>{
            let usuario = usr.data()
            if(usuario['telefono'] == phone){
              band = true;
            }
          });
          if(band){
            signInWithPhoneNumber(this.auth, phone, this.appVerifier)
            .then((confirmResult) => {
              Swal.fire({
                title: 'Confirma el código',
                html: `<input type="number" id="codigo" class="swal2-input" placeholder="Codigo de confirmación">`,
                confirmButtonText: 'Confirmar',
                focusConfirm: false,
                preConfirm: () => {
                  const popup = Swal.getPopup();
                  if(popup){
                    let recupera = <HTMLInputElement> popup.querySelector('#codigo');
                    const login = recupera.value;
                    if (!login) {
                      Swal.showValidationMessage(`Introduce el código de confirmación`)
                    }
                    return { login: login }
                  }
                  return null;
                }
              }).then((result) => {
                if(result){
                  confirmResult.confirm(result.value?.login || "")
                    .then((confirmacion)=>{
                      Swal.fire(
                        'Inicio de sesión',
                        'Se ha iniciado correctamente, ' + this.auth.currentUser?.displayName,
                        'success'
                      ).then(()=>{
                          this.clearSesionwPhone();
                          this.reactivarBoton(button, "Iniciar Sesión");
                          this.router.navigate(['catalogo']);
                        }
                      );
                    })
                    .catch((error)=>{
                      Swal.fire(
                        'Inicio de sesión',
                        'Ha ocurrido un error: ' + error,
                        'error').then(()=>{
                          this.reactivarBoton(button, "Iniciar Sesión");
                        });
                    });
                }
              })
            }).catch((error)=>{
              Swal.fire(
                'Inicio de sesión',
                'Ha ocurrido un error: ' + error,
                'error').then(()=>{
                  this.reactivarBoton(button, "Iniciar Sesión");
                });
            });
          }else{
            Swal.fire('Inicio de sesión', 'Debe estar registrado para iniciar sesión con un número telefonico', 'error').then(()=>{
              this.reactivarBoton(button, "Iniciar Sesión");
            });;
          }
        });
      }else{
        Swal.fire('Inicio de sesión', 'Verifique que los datos estén completos', 'error');
      }
    }else {
      Swal.fire('Inicio de sesión', 'Verifique que los datos estén completos', 'error');
    }
  }

  reactivarBoton(button:HTMLInputElement, text:string){
    if(button){
      button.innerHTML = `
        ${text}
      `;
    }
    button.removeAttribute("disabled");
  }

  clearForm(){
    this.usuario.reset({
      nombre: "",
      email: "",
      usrName: "",
      telefono: "",
      gender: "",
      passwd: ""
    });
    this.passwdConf.reset('');
  }

  clearSesion(){
    this.sesion.reset({
      usrNameLog: "",
      passwdLog: ""
    })
  }

  clearSesionwPhone(){
    this.phone.reset({
      numberphone: '',
    })
  }

  public get name() {
    return this.usuario.get('nombre');
  }

  public get email() {
    return this.usuario.get('email');
  }

  public get usrName() {
    return this.usuario.get('usrName');
  }

  public get telefono() {
    return this.usuario.get('telefono');
  }

  public get passwd() {
    return this.usuario.get('passwd');
  }

  public get gender() {
    return this.usuario.get('gender');
  }

  public get passwdLog() {
    return this.sesion.get('passwdLog');
  }

  public get usrNameLog() {
    return this.sesion.get('usrNameLog');
  }
  checkPsswd(): boolean {
    if (this.usuario.get('passwd')?.value === this.passwdConf.value) {
      return true;
    }
    return false;
  }

  public get numberphone(){
    return this.phone.get('numberphone');
  }

}
