import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ServicesService } from '../../services.service';
import { Router } from '@angular/router';
import UserFormat from '../../interfaces/user.interface';

@Component({
  selector: 'app-view-main',
  templateUrl: './view-main.component.html',
  styleUrls: ['./view-main.component.css']
})
export class ViewMainComponent implements OnInit {
  dataUser: UserFormat = {
    name: '',
    nickname: ''
  }
  constructor(
    private service: ServicesService,
    private router: Router,
    private renderer: Renderer2,
    ) { }
    @ViewChild('titleContent') titleContent!: ElementRef;
    @ViewChild('txtContent') txtContent!: ElementRef;
    statusNewStickyNote: boolean = false;
    statusAsignLabel: boolean = false;

  ngOnInit(): void {
    this.service.$showModelStickyNote.subscribe((valor) => {
      this.statusNewStickyNote = valor;
    });
    this.service.$takeData.subscribe((currUser) => {
      this.dataUser = {
        id: currUser.id,
        name: currUser.name,
        nickname: currUser.nickname,
      }
    });
  }

  targetElementTitleNote(event: any) {
    if(this.titleContent.nativeElement.innerHTML === 'Cosas por hacer...') {
      this.titleContent.nativeElement.innerHTML = '';
      this.renderer.setStyle(this.titleContent.nativeElement, 'color', 'black');
      this.renderer.setStyle(this.titleContent.nativeElement, 'font-style', 'normal');
      this.renderer.setStyle(this.titleContent.nativeElement, 'font-weight', 'bold'); 
    }
  }

  targetElementTxtNote(event: any) {
    if(this.txtContent.nativeElement.innerHTML === 'Comprar pan, comprar café...') {
      this.txtContent.nativeElement.innerHTML = '';
      this.renderer.setStyle(this.txtContent.nativeElement, 'color', 'black');
      this.renderer.setStyle(this.txtContent.nativeElement, 'font-style', 'normal');
      this.renderer.setStyle(this.titleContent.nativeElement, 'font-weight', 'bold'); 
    }
  }

  selectLabel() {
    this.statusAsignLabel = true;
  }
  saveNewNote() {
    this.statusAsignLabel = false;
    this.statusNewStickyNote = false;
  }

  closeCreatedNote() {
    this.statusAsignLabel = false;
    this.statusNewStickyNote = false;
  }

  ngAfterViewInit(): void { }

}
