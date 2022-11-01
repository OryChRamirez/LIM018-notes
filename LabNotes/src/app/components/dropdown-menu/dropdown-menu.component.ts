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
  dropdownMenu: boolean = false;
  dataUser: UserFormat = {
    name: '',
    nickname: '',
    id: '',
  };
  nicknameUser: string = '';
  listOfLabels: Array<string> = [];

  constructor(
    private renderer: Renderer2,
    private service: ServicesService,
    private router: Router,
    private router2: ActivatedRoute,
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
      this.renderer.setStyle(this.seccContDropdownMenu.nativeElement, 'width', '3.5rem');
    } else {
      this.dropdownMenu = true;
      this.renderer.setStyle(this.btnDropdownMenu.nativeElement, 'align-self', 'flex-end')
      this.renderer.setStyle(this.seccContDropdownMenu.nativeElement, 'width', '10rem');
    }
  }

  ngAfterViewInit() { }

}
