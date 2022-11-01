import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ServicesService } from '../../services.service';
import { Router } from '@angular/router';
import UserFormat from '../../interfaces/user.interface';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.css']
})
export class ViewLoginComponent implements OnInit {

  constructor(
    private service:ServicesService,
    private router: Router,
    private renderer: Renderer2,
    ) { }

    @ViewChild('msgError') msgError!: ElementRef;
    @ViewChild('emailUser') emailUser!: ElementRef;
    @ViewChild('passwordUser') passwordUser!: ElementRef;
    statusUser: boolean = false;
    dataUser: UserFormat = {
      name: '',
      nickname: '',
      id: '',
    };

  ngOnInit(): void { }

  onSubmitGoogle() { //REGISTRO DE USUARIO CON GOOGLE
    this.service.loginWithGoogle()
    .then((response) => {
      this.dataUser = {
        id: response.user.uid,
        name: response.user.displayName!,
        nickname: response.user.displayName?.substring(0, response.user.displayName.indexOf(' '))!,
      };
      this.service.$takeData.emit(this.dataUser);
      this.service.addDataUser(this.dataUser, response.user.uid);
      this.router.navigate(['/main'], {queryParams: { user: this.dataUser.nickname}});
  })
    .catch((error)=> console.log(error));
    this.service.$takeData.emit
  };

  validationEmail(event: any) { //METODO PARA VALIDAR QUE EL EMAIL PUEDA VERIFICARSE
    const condition = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const stateCondition = condition.test(event.target.value);
    if(!stateCondition) {
      this.msgError.nativeElement.innerHTML = 'Debes ingresar un email válido: ejemplo@dominio.com';
      this.renderer.setStyle(this.msgError.nativeElement, 'text-align', 'center');
    } else {
      this.msgError.nativeElement.innerHTML = '';
    }
  }
  
  onSubmitWithEmailAndPass() { // METODO PARA INICIAR SESION CON EMAIL Y CONTRASEÑA
    const emailUser: string = this.emailUser.nativeElement.value;
    const passUser: string = this.passwordUser.nativeElement.value;
    if(emailUser !== '' && passUser !== '') {
      this.msgError.nativeElement.innerHTML = '';
      this.service.signInWithEmailAndPass(this.emailUser.nativeElement.value, this.passwordUser.nativeElement.value)
      .then((response) => {
        if(response.user.emailVerified === true) {
          this.dataUser = {
            id: response.user.uid,
            name: response.user.displayName!,
            nickname: response.user.displayName?.substring(0, response.user.displayName.indexOf(' '))!,
          };
          this.service.$takeData.emit(this.dataUser);
          this.router.navigate(['/main'], {queryParams: { user: this.dataUser.nickname}});
        } else {
          this.msgError.nativeElement.innerHTML = 'Debes verificar tu email para continuar';
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        switch (errorMessage) {
          case 'Firebase: Error (auth/user-not-found).': {
            this.msgError.nativeElement.innerHTML = 'Usuario no encontrado';
            break;
          }
          case 'Firebase: Error (auth/wrong-password).': {
            this.msgError.nativeElement.innerHTML = 'Contraseña incorrecta';
            break;
          }
          // ESTE ES PARA EL ERROR DE FIREBASE: Error (auth/invalid-email). Email inválido.
          default: this.msgError.nativeElement.innerHTML = 'Email inválido';
            break;
        }
      });
    }
  }

  singOutUser() { //METODO PARA PODER CERRAR SESIÓN
    this.service.singOutUser();
  }
}
