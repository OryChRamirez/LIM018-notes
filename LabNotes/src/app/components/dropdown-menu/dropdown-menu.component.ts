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

  dropdownMenu: boolean = true;
  optionsEditAndDeleteLabels: boolean = false;
  modalChangeNameUser: boolean = false;
  statusAsignLabel: boolean = false;
  modalNewLabel: boolean = false;
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

  constructor(
    private renderer: Renderer2,
    private service: ServicesService,
    ) {}

  ngOnInit(): void {
    this.service.getDataLabelsByUser(this.currUser!).subscribe((valor) => {
      this.arrLabelsByUser = valor;
    });
    
    this.service.$showModalChangeNickname.subscribe((valor) => {
      this.modalChangeNameUser = valor;
    })
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
    this.service.$showModelStickyNote.emit(false);
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

  editLabelById(idLabel: number) {
    this.statusAsignLabel? this.statusAsignLabel = false: this.statusAsignLabel = true;
    this.modalNewLabel = true;

  }

  
  deleteLabelById(idLabel: number) {
    console.log(idLabel);
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
  }

  closeModalNewLabel() {
    this.modalNewLabel = false;
  }

  targetElementnewLabel(event: any) {
    this.labelName.nativeElement.value = '';
  }

}
