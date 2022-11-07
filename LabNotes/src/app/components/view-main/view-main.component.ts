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
  idLabelToAssign: string = '';
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
    @ViewChild('colorValue') colorValue!: ElementRef;
    statusNewStickyNote: boolean = true;
    statusAssignLabel: boolean = true;
    arrLabelsByUser: Array<any> = [];
    currUser: any = this.service.getCurrUser();


  ngOnInit(): void {
    this.service.$showModelStickyNoteFromDropdown .subscribe((valor)=> this.statusNewStickyNote = valor);
    this.service.$showModelStickyNoteFromHeader.subscribe((valor)=> this.statusNewStickyNote = valor);
    this.service.$takeData.subscribe((currUser) => {
      this.dataUser = {
        id: currUser.id,
        name: currUser.name,
        nickname: currUser.nickname,
      }
    });

    this.service.getDataLabelsByUser(this.currUser!).subscribe((valor) => { //TRAE LAS ETIQUETAS DEL USUARIO LOGUEADO
      this.arrLabelsByUser = valor;
      console.log(this.arrLabelsByUser);
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
    this.statusAssignLabel? this.statusAssignLabel = false: this.statusAssignLabel = true; 
  }

  getValuesOfLabel(even: any, idLabel: string) {
    if(even.target) {
      this.idLabelToAssign = idLabel;
    }
    console.log(this.idLabelToAssign);
  }
  saveNewNote() {
    this.statusAssignLabel = false;
    this.statusNewStickyNote = false;
  }

  closeCreatedNote() {
    this.statusAssignLabel = false;
    this.statusNewStickyNote = false;
  }

  ngAfterViewInit(): void { }

}
