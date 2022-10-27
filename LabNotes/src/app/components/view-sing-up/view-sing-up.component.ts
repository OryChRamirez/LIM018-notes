import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ServicesService } from '../../services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-sing-up',
  templateUrl: './view-sing-up.component.html',
  styleUrls: ['./view-sing-up.component.css']
})
export class ViewSingUpComponent implements OnInit {
  constructor(
    private service: ServicesService,
    private renderer: Renderer2,
    private router: Router,
    ) {}

    @ViewChild('emailUser') emailUser!: ElementRef;
    @ViewChild('nameUser') nameUser!: ElementRef;
    @ViewChild('nicknameUser') nicknameUser!: ElementRef;
    @ViewChild('passwordUser') passwordUser!: ElementRef;
    @ViewChild('msgError') msgError!: ElementRef;


  ngOnInit(): void {
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
  onSubmitEmailAndPass() { //REGISTRA AL USUARIO CON EMAIL Y CONTRASEÑA
    const emailUser = this.emailUser.nativeElement.value;
    const nameUser = this.nameUser.nativeElement.value;
    const nicknameUser = this.nicknameUser.nativeElement.value;
    const passwordUser = this.passwordUser.nativeElement.value;
    if (emailUser !== '' && nameUser !== '' && nicknameUser !== '' && passwordUser !== '') {
      this.msgError.nativeElement.innerHTML = '';
      this.service.register(emailUser, passwordUser)
      .then(response => {
        this.router.navigate(['/login']);
      })
      .catch( (error) => {
        const errorMessage = error.message;
        // CONTROL DE ERRORES PARA MOSTRAR EN EL DOM
        switch (errorMessage) {
          case 'Firebase: Error (auth/email-already-in-use).': {
            this.msgError.nativeElement.innerHTML = 'El correo ya se encuentra registrado';
            break;
          }
          case 'Firebase: Password should be at least 6 characters (auth/weak-password).': {
            this.msgError.nativeElement.innerHTML = 'La contraseña debe tener al menos 6 caracteres';
            break;
          }
          case 'Firebase: Error (auth/invalid-email).': {
            this.msgError.nativeElement.innerHTML = 'Debes ingresar un email válido: ejemplo@dominio.com';
            break;
          }
          default: this.msgError.nativeElement.innerHTML = 'Error no verificado';
            break;
        }
      });
    } else {
      console.log(this.msgError.nativeElement.innerHTML);
      this.msgError.nativeElement.innerHTML = 'Debes completar los campos';
    }
  }

  onSubmitGoogle() { //REGISTRO DE USUARIO CON GOOGLE
    this.service.loginWithGoogle()
    .then(() => this.router.navigate(['/main']))
    .catch((error)=> console.log(error));
  }

}
