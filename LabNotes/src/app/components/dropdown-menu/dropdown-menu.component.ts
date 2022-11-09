import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import UserFormat from 'src/app/interfaces/user.interface';
import { ServicesService } from 'src/app/services.service';
import labelFormat from 'src/app/interfaces/labels.interface';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
})
export class DropdownMenuComponent implements OnInit {
  @ViewChild('seccContDropdownMenu') seccContDropdownMenu!: ElementRef;
  @ViewChild('btnDropdownMenu') btnDropdownMenu!: ElementRef;
  @ViewChild('labelListStyle') labelListStyle!: ElementRef;
  @ViewChild('changeNicknameUser') changeNicknameUser!: ElementRef;
  @ViewChild('btnEditLabelName') btnEditLabelName!: ElementRef;
  @ViewChild('labelName') labelName!: ElementRef;
  @ViewChild('inputColor') inputColor!: ElementRef;
  @ViewChild('msgError') msgError!: ElementRef;
  @ViewChild('notesIcon') notesIcon!: ElementRef;
  @ViewChild('archivedIcon') archivedIcon!: ElementRef;
  @ViewChild('trashIcon') trashIcon!: ElementRef;


  dropdownMenu: boolean = false;
  modalChangeNameUser: boolean = false;
  statusAssignLabel: boolean = false;
  modalEditLabel: boolean = false;
  modalDeleteLabel: boolean = false;
  changeColorNoteIcon: boolean = false;

  showNotes: any = {
    allNotes: true,
    archivedNotes: false,
    trashNotes: false,
  }

  actualLabel: labelFormat = {
    idUser: '',
    nameLabel: '',
    colorLabel: '',
  } 

  currUser: any = this.service.getCurrUser();
  arrLabelsByUser: Array<any> = [];
  dataUser: UserFormat = {
    name: '',
    nickname: '',
    id: '',
  };

  newLabel: labelFormat = {
    idUser: '',
    nameLabel: '',
    colorLabel: '',
  }

  nicknameUser!: string;
  idActualLabel!: string;

  constructor(
    private renderer: Renderer2,
    private service: ServicesService,
    ) {}

  ngOnInit(): void {

    this.service.$closeModalsOfDropdown.subscribe((valor) => { //CIERRA TODOS LOS MODALES CUANDO SE DA CLICK EN ALGUN MODAL DEL HEADER
      this.modalChangeNameUser = valor;
      this.statusAssignLabel = valor;
      this.modalEditLabel = valor;
      this.modalDeleteLabel = valor;
    })
    this.service.$changeColorBlack.subscribe((valor) => {
      this.renderer.setStyle(this.archivedIcon.nativeElement, 'color', valor);
      this.renderer.setStyle(this.trashIcon.nativeElement, 'color', valor);  
    })
    this.service.$changeColorWhite.subscribe((valor) => this.renderer.setStyle(this.notesIcon.nativeElement, 'color', valor));
    this.service.getDataLabelsByUser(this.currUser!).subscribe((valor) => { //TRAE LAS ETIQUETAS DEL USUARIO LOGUEADO
      this.arrLabelsByUser = valor;
      this.renderer.setStyle(this.notesIcon.nativeElement, 'color', 'white');
    });
    this.service.getDataUser().forEach((users) => { //TRAE LOS DATOS DEL USUARIO LOGUEADO
      users.forEach((user) => {
        if(user.id === this.service.getCurrUser()) {
          this.nicknameUser = user.nickname;
        };
      });
    });
  }

  ngAfterViewInit(){
    this.service.$showFilterNotes.emit(this.showNotes);
  }
  activeDropdownMenu() { // MUESTRA U OCULTA LAS OPCIONES DEL MENU LATERAL AL DARLE CLICK
    if (this.dropdownMenu === true) {
      this.dropdownMenu = false;
      this.renderer.setStyle(this.btnDropdownMenu.nativeElement, 'align-self', 'center')
      this.renderer.setStyle(this.seccContDropdownMenu.nativeElement, 'width', 'max-content');
      this.renderer.setStyle(this.labelListStyle.nativeElement, 'border-top', 'none');
    } else {
      this.dropdownMenu = true;
      this.renderer.setStyle(this.btnDropdownMenu.nativeElement, 'align-self', 'flex-end')
      this.renderer.setStyle(this.seccContDropdownMenu.nativeElement, 'width', 'max-content');
      this.renderer.setStyle(this.labelListStyle.nativeElement, 'border-top', ' 0.1rem dotted');
    }
  }

  showModalChangeNickname() { //MUESTRA EL MODAL PARA CAMBIAR EL NICK DEL USUARIO
    this.service.$closeModalsOfHeader.emit(false);
    this.service.$showModelStickyNoteFromDropdown.emit(false);
    this.modalDeleteLabel = false;
    this.modalEditLabel = false;

    if(this.modalChangeNameUser === true) {
      this.modalChangeNameUser = false;
    } else {
      this.modalChangeNameUser = true;
    }
    this.activeDropdownMenu();
    this.dropdownMenu = true;
  }

  targetElementNickname(event: any) { //LIMPIA EL NOMBRE DE USUARIO AL DARLE CLICK AL INPUT
    this.changeNicknameUser.nativeElement.value = '';
  }

  async changeNickname() { //FUNCIÓN PARA CAMBIAR EL NICK DEL USUARIO EN FIRESTORE
  let nickname = this.changeNicknameUser.nativeElement.value; 
  this.modalChangeNameUser = false;
  const response = await this.service.changeNicknameOrName(this.currUser, nickname);
  }
  
  closeModalChangeNickname() { // CIERRA EL MODAL DE CAMBIO DE NOMBRE EN CASO DE CANCELAR LA ACCIÓN
    this.modalChangeNameUser = false;
  }

  editLabelById(idLabel: string) { //ABRE EL MODAL DE EDITAR ETIQUETA
    this.service.$closeModalsOfHeader.emit(false);
    this.service.$showModelStickyNoteFromDropdown.emit(false);
    this.modalChangeNameUser = false;
    this.arrLabelsByUser.forEach((label) => {
      if(idLabel === label.id) {
        this.idActualLabel = idLabel;
      }
    })
    this.statusAssignLabel? this.statusAssignLabel = false: this.statusAssignLabel = true;
    this.modalEditLabel = true;
    this.modalDeleteLabel = false;

  }

  
  deleteLabelById(idLabel: string) { //ABRE EL MODAL DE BORRAR ETIQUETA
    this.service.$closeModalsOfHeader.emit(false);
    this.service.$showModelStickyNoteFromDropdown.emit(false);
    this.arrLabelsByUser.forEach((label) => {
      if(idLabel === label.id) {
        this.idActualLabel = idLabel;
      }
    })
    this.modalChangeNameUser = false;
    this.modalDeleteLabel = true;
    this.modalEditLabel = false;
  }

  confirmDeleteLabel(idLabel: string){ //FUNCIÓN PARA ELIMINAR ETIQUETA
    this.service.deleteLabel(this.idActualLabel);
    this.modalDeleteLabel = false;
  }
  cancelDeleteLabel() { //FUNCIÓN PARA CANCELAR EL ELIMINAR ETIQUETA
    this.modalDeleteLabel = false;
  }

  changeLabel() { //FUNCIÓN PARA EDITAR EL NOMBRE Y COLOR DE LA ETIQUETA
    const color = this.inputColor.nativeElement.value;
    const label = this.labelName.nativeElement.value;
    const idUser = this.currUser;
      const labelExist = this.arrLabelsByUser.find((labelData) => labelData.nameLabel === label);
      if(labelExist !== undefined || label === 'Nuevo Nombre...') {
        this.msgError.nativeElement.innerHTML = 'Elige otro nombre para la etiqueta'
      } else {
        this.msgError.nativeElement.innerHTML = ''
        this.service.updateLabel(this.idActualLabel, label, color)
        this.modalEditLabel = false;
      }
  }

  closeModalEditLabel() { //CIERRA EL MODAL DE EDITAR ETIQUETA
    this.modalEditLabel = false;
  }

  targetElementnewLabel(event: any) { //LIMPIA EL NOMBRE DE LA ETIQUETA AL DARLE CLICK AL INPUT
    this.labelName.nativeElement.value = '';
  }

  showAllNotes(){
    this.showNotes = {
      allNotes: true,
      archivedNotes: false,
      trashNotes: false,
    }
    this.service.$showFilterNotes.emit(this.showNotes);
    this.renderer.setStyle(this.notesIcon.nativeElement, 'color', 'white');
    this.renderer.setStyle(this.archivedIcon.nativeElement, 'color', 'black');
    this.renderer.setStyle(this.trashIcon.nativeElement, 'color', 'black');
  }

  showTrashNotes(){
    this.showNotes = {
      allNotes: false,
      archivedNotes: false,
      trashNotes: true,
    }
    this.service.$showFilterNotes.emit(this.showNotes);
    this.renderer.setStyle(this.trashIcon.nativeElement, 'color', 'white');
    this.renderer.setStyle(this.archivedIcon.nativeElement, 'color', 'black');
    this.renderer.setStyle(this.notesIcon.nativeElement, 'color', 'black');
  }

  showArchivedNotes(){
    this.showNotes = {
      allNotes: false,
      archivedNotes: true,
      trashNotes: false,
    }

    this.service.$showFilterNotes.emit(this.showNotes);
    this.renderer.setStyle(this.archivedIcon.nativeElement, 'color', 'white');
    this.renderer.setStyle(this.trashIcon.nativeElement, 'color', 'black');
    this.renderer.setStyle(this.notesIcon.nativeElement, 'color', 'black');
  }
}
