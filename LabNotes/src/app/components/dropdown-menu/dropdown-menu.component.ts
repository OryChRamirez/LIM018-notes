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

  dropdownMenu: boolean = true;
  optionsEditAndDeleteLabels: boolean = false;
  modalChangeNameUser: boolean = false;
  statusAsignLabel: boolean = false;
  modalEditLabel: boolean = false;
  modalDeleteLabel: boolean = false;
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
    this.service.$closeModalsOfDropdown.subscribe((valor) => {
      this.modalChangeNameUser = valor;
      this.statusAsignLabel = valor;
      this.modalEditLabel = valor;
      this.modalDeleteLabel = valor;
    })
    this.service.getDataLabelsByUser(this.currUser!).subscribe((valor) => {
      this.arrLabelsByUser = valor;
      console.log(this.arrLabelsByUser);
    });
    this.service.getDataUser().forEach((users) => {
      users.forEach((user) => {
        if(user.id === this.service.getCurrUser()) {
          this.nicknameUser = user.nickname;
        };
      });
    });
  }

  activeDropdownMenu() {
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

  activeOptionsLabels(idLabel: string) {
    if(this.optionsEditAndDeleteLabels === true) {
      this.optionsEditAndDeleteLabels = false;
    } else {
      this.optionsEditAndDeleteLabels = true;
    }
    console.log(idLabel);
  }

  showModalChangeNickname() {
    this.service.$closeModalsOfHeader.emit(false);
    this.service.$showModelStickyNoteFromDropdown.emit(false);
    this.modalDeleteLabel = false;
    this.modalEditLabel = false;

    if(this.modalChangeNameUser === true) {
      this.modalChangeNameUser = false;
    } else {
      this.modalChangeNameUser = true;
    }
  }

  targetElementNickname(event: any) {
    this.changeNicknameUser.nativeElement.value = '';
  }

  async changeNickname() {
  let nickname = this.changeNicknameUser.nativeElement.value; 
  this.modalChangeNameUser = false;
  const response = await this.service.changeNicknameOrName(this.currUser, nickname);
  }
  
  closeModalChangeNickname() {
    this.modalChangeNameUser = false;
  }

  editLabelById(idLabel: string) {
    this.service.$closeModalsOfHeader.emit(false);
    this.service.$showModelStickyNoteFromDropdown.emit(false);
    this.modalChangeNameUser = false;
    this.arrLabelsByUser.forEach((label) => {
      if(idLabel === label.id) {
        this.idActualLabel = idLabel;
      }
    })
    console.log(this.idActualLabel);
    this.statusAsignLabel? this.statusAsignLabel = false: this.statusAsignLabel = true;
    this.modalEditLabel = true;
    this.modalDeleteLabel = false;

  }

  
  deleteLabelById() {
    this.service.$closeModalsOfHeader.emit(false);
    this.service.$showModelStickyNoteFromDropdown.emit(false);
    this.modalChangeNameUser = false;
    this.modalDeleteLabel = true;
    this.modalEditLabel = false;

  }

  confirmDeleteLabel(idLabel: string){
    this.service.deleteLabel(idLabel);
    this.modalDeleteLabel = false;
  }
  cancelDeleteLabel() {
    this.modalDeleteLabel = false;
  }

  changeLabel() {
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

  closeModalNewLabel() {
    this.modalEditLabel = false;
  }

  targetElementnewLabel(event: any) {
    this.labelName.nativeElement.value = '';
  }

}
