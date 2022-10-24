import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../../services.service';

@Component({
  selector: 'app-view-sing-up',
  templateUrl: './view-sing-up.component.html',
  styleUrls: ['./view-sing-up.component.css']
})
export class ViewSingUpComponent implements OnInit {
  constructor(
    private service: ServicesService
    ) {}

    @ViewChild('emailUser') emailUser!: ElementRef;
    @ViewChild('passwordUser') passwordUser!: ElementRef;

  ngOnInit(): void {
  }

  onSubmitEmailAndPass() { //REGISTRA AL USUARIO CON EMAIL Y CONTRASEÑA
    this.service.register(this.emailUser.nativeElement.value, this.passwordUser.nativeElement.value)
    .then(response => {
      console.log(response);
    })
    .catch( (error) => {
      console.log(error, 'ERROR EMITIDO');
  })
  }

  onSubmitGoogle() {
    this.service.loginWithGoogle();
  }

}
