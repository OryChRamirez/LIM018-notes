import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ServicesService } from '../../services.service';
import { Router } from '@angular/router';

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

  ngOnInit(): void {
  }

  onSubmitGoogle() { //REGISTRO DE USUARIO CON GOOGLE
    this.service.loginWithGoogle()
    .then(() => this.router.navigate(['/main']))
    .catch((error)=> console.log(error));
  }

  validationEmail(event: any) {
    const condition = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const stateCondition = condition.test(event.target.value);
    if(!stateCondition) {
      this.msgError.nativeElement.innerHTML = 'Debes ingresar un email válido: ejemplo@dominio.com';
      this.renderer.setStyle(this.msgError.nativeElement, 'text-align', 'center');
    } else {
      this.msgError.nativeElement.innerHTML = '';
    }
  }
  onSubmitWithEmailAndPass() {
    const emailUser: string = this.emailUser.nativeElement.value;
    const passUser: string = this.passwordUser.nativeElement.value;
    if(emailUser !== '' && passUser !== '') {
      this.msgError.nativeElement.innerHTML = '';
      this.service.signInWithEmailAndPass(this.emailUser.nativeElement.value, this.passwordUser.nativeElement.value)
      .then((userCredentials) => {
        console.log(userCredentials);
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
          // Este es para el error Firebase: Error (auth/invalid-email). Email inválido.
          default: this.msgError.nativeElement.innerHTML = 'Email inválido';
            break;
        }
      });
    }
  }

  singOutUser() {
    this.service.singOutUser();
  }
}
