import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../../services.service';
import labelFormat from '../../interfaces/labels.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private service: ServicesService,
    private router: Router,
    ) { }

  currUser = this.service.getCurrUser();
  statusAssignLabel: boolean = false;
  modalNewLabel: boolean = false;
  arrLabelsByUser!: Array<any>;
  newLabel: labelFormat = {
    idUser: '',
    nameLabel: '',
    colorLabel: '',
  }


  @ViewChild('labelName') labelName!: ElementRef;
  @ViewChild('inputColor') inputColor!: ElementRef;
  @ViewChild('msgError') msgError!: ElementRef;

  ngOnInit(): void {
    this.service.$closeModalsOfHeader.subscribe((valor) => { //CIERRA LOS MODALES DE HEADER CUANDO SE ABRE UNO DEL DROPDOWN
      this.statusAssignLabel = valor;
      this.modalNewLabel = valor;
    })  
    this.service.getDataLabelsByUser(this.currUser!).subscribe((valor) => { //TRAE LAS ETIQUETAS DEL USUARIO
      this.arrLabelsByUser = valor;
    });
  }


  showModalLabels() { //MUESTRA U OCULTA EL MODAL DE AGREGAR ETIQUETAS
    this.statusAssignLabel? this.statusAssignLabel = false: this.statusAssignLabel = true;
  }

  createStickyNote() { // MUESTRA EL MODAL PARA CREAR NOTAS
    this.service.$closeModalsOfDropdown.emit(false);
    this.service.$showModelStickyNoteFromHeader.emit(true);
    this.statusAssignLabel = false;
    this.modalNewLabel = false;
  }

  signOut() { // FUNCIÓN PARA EL BOTÓN DE CERRAR SESIÓN
    this.service.singOutUser()
    .then(() => this.router.navigate(['/login']));
  }

  showModalNewLabel() { //MUESTRA EL MODAL PARA CREAR ETIQUETAS NUEVAS
    this.service.$closeModalsOfDropdown.emit(false);
    this.service.$showModelStickyNoteFromHeader.emit(false);
    this.statusAssignLabel? this.statusAssignLabel = false: this.statusAssignLabel = true;
    this.modalNewLabel = true;
  }

  saveNewLabel() { //FUNCIÓN PARA CREAR LAS ETIQUETAS NUEVAS
    const color = this.inputColor.nativeElement.value;
    const label = this.labelName.nativeElement.value;
    const idUser = this.currUser;
    this.newLabel = {
      idUser: idUser!,
      nameLabel: label,
      colorLabel: color,
        }
      const labelExist = this.arrLabelsByUser.find((labelData) => labelData.nameLabel === label);
      if(labelExist !== undefined || label === 'Ejemplo...') {
        this.msgError.nativeElement.innerHTML = 'Elige otro nombre para la etiqueta'
      } else {
        this.msgError.nativeElement.innerHTML = ''
        this.service.addDataLabels(this.newLabel);
        this.modalNewLabel = false;
      }
  }

  closeModalNewLabel() { //CIERRA EL MODAL DE ETIQUETA NUEVA EN CASO DE CANCELAR
    this.modalNewLabel = false;
  }

  targetElementnewLabel(event: any) { //LIMPIA EL NOMBRE DE LA ETIQUETA AL DARLE CLICK AL INPUT
    this.labelName.nativeElement.value = '';
  }
}
