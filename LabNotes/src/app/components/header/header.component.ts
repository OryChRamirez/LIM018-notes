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
  statusAsignLabel: boolean = false;
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
    this.service.$closeModalsOfHeader.subscribe((valor) => {
      this.statusAsignLabel = valor;
      this.modalNewLabel = valor;
    })  
    this.service.getDataLabelsByUser(this.currUser!).subscribe((valor) => {
      this.arrLabelsByUser = valor;
    });
  }


  showModalLabels() {
    this.statusAsignLabel? this.statusAsignLabel = false: this.statusAsignLabel = true;
  }

  createStickyNote() {
    this.service.$closeModalsOfDropdown.emit(false);
    this.service.$showModelStickyNoteFromHeader.emit(true);
    this.statusAsignLabel = false;
    this.modalNewLabel = false;
  }

  signOut() {
    this.service.singOutUser()
    .then(() => this.router.navigate(['/login']));
  }

  showModalNewLabel() {
    this.service.$closeModalsOfDropdown.emit(false);
    this.service.$showModelStickyNoteFromHeader.emit(false);
    this.statusAsignLabel? this.statusAsignLabel = false: this.statusAsignLabel = true;
    this.modalNewLabel = true;
  }

  saveNewLabel() {
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

  closeModalNewLabel() {
    this.modalNewLabel = false;
  }

  targetElementnewLabel(event: any) {
    this.labelName.nativeElement.value = '';
  }
}
