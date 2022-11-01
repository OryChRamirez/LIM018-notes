import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import UserFormat from 'src/app/interfaces/user.interface';
import { ServicesService } from 'src/app/services.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  dropdownMenu: boolean = false;
  optionsEditAndDeleteLabels: boolean = false;
  modalChangeNameUser: boolean = false;
  currUser: any = this.service.getCurrUser();
  dataUser: UserFormat = {
    name: '',
    nickname: '',
    id: '',
  };
  nicknameUser: string = '';
  listOfLabels: Array<string> = ['1'];

  constructor(
    private renderer: Renderer2,
    private service: ServicesService,
    ) {}

  ngOnInit(): void {
  this.service.getDataUser().forEach((users) => {
    users.forEach((user) => {
      if(user.id === this.service.getCurrUser()) {
        this.nicknameUser = user.nickname;
      };
    });
  });
  console.log(this.listOfLabels[0]);
  
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

  activeOptionsLabels() {
    if(this.optionsEditAndDeleteLabels === true) {
      this.optionsEditAndDeleteLabels = false;
    } else {
      this.optionsEditAndDeleteLabels = true;
    }
  }

  showModalChangeNickname() {
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
  if(nickname === '') {
     nickname = this.nicknameUser;
  }
  const response = await this.service.changeNicknameOrName(this.currUser, nickname);
  this.modalChangeNameUser = false;
  }
  
  closeModalChangeNickname() {
    this.modalChangeNameUser = false;
  }
}
