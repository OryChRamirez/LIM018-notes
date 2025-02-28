import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServicesService } from '../../services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(
    private service: ServicesService,
    private router: Router,
  ) { }

  @ViewChild('emailUser') emailUser!: ElementRef;
  @ViewChild('msgError') msgError!: ElementRef;
  statusModal: boolean = false;
  
  ngOnInit(): void {
  }

  resetPass() { //FUNCIÓN PARA ENVIAR UN CORREO Y RESTAURAR EL PASSWORD DEL USUARIO 
    const emailUser = this.emailUser.nativeElement.value;
    if(emailUser !== '') {
      this.msgError.nativeElement.innerHTML = '';
      this.service.resetPassword(this.emailUser.nativeElement.value)
      .then((response) =>{
        this.statusModal = true;
      })
      .catch((error) =>{
        const errorMessage = error.message;
        switch (errorMessage) {
          case 'Firebase: Error (auth/user-not-found).': {
            this.msgError.nativeElement.innerHTML = 'Usuario no encontrado';
            break;
          }
          // ESTE ES PARA EL ERROR DE FIREBASE: Error (auth/invalid-email). Email inválido.
          default: this.msgError.nativeElement.innerHTML = 'Email inválido';
            break;
        }
      });
    } else {
      this.msgError.nativeElement.innerHTML = 'Debes ingresar un correo';
    }
  }

  returnToLoging() {
    this.router.navigate(['login']);
  }
}
