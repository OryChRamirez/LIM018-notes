import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ServicesService } from '../../services.service';
import UserFormat from '../../interfaces/user.interface';
import NotesFormat from '../../interfaces/notes.interface';
import labelFormat from '../../interfaces/labels.interface';

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
    private renderer: Renderer2,
    ) { }
    @ViewChild('titleContent') titleContent!: ElementRef;
    @ViewChild('txtContent') txtContent!: ElementRef;
    @ViewChild('colorValue') colorValue!: ElementRef;
    @ViewChild('labelName') labelName!: ElementRef;
    @ViewChild('txtAssignLabel') txtAssignLabel!: ElementRef;
    @ViewChild('bookmarkLabel') bookmarkLabel!: ElementRef;
    @ViewChild('msgError') msgError!: ElementRef;
  
    statusNewStickyNote: boolean = false;
    statusAssignLabel: boolean = false;
    arrLabelsByUser: Array<any> = [];
    labelAssignId!: string;
    labelAssignName!: string;
    labelAssignColor!: string;

    currUser: any = this.service.getCurrUser();
    newNote: NotesFormat = {
      idUser: '',
      category: {
        id: '',
        nameLabel: '',
        colorLabel: '',
      },
      title: '',
      contNote: '',
      status: {
        archived: false,
        trash: false,
      }
    }


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
    });
  }

  targetElementTitleNote() {
    this.msgError.nativeElement.innerHTML = '';
    if(this.titleContent.nativeElement.innerHTML === 'TITULO' || this.titleContent.nativeElement.innerHTML === 'ELIGE UN TITULO') {
      this.titleContent.nativeElement.innerHTML = '';
      this.renderer.setStyle(this.titleContent.nativeElement, 'color', 'black');
      this.renderer.setStyle(this.titleContent.nativeElement, 'font-style', 'normal');
      this.renderer.setStyle(this.titleContent.nativeElement, 'font-weight', 'bold'); 
    }
  }

  targetElementTxtNote() {
    this.msgError.nativeElement.innerHTML = '';
    if(this.txtContent.nativeElement.innerHTML === 'CONTENIDO'|| this.txtContent.nativeElement.innerHTML === 'ELIGE UN CONTENIDO') {
      this.txtContent.nativeElement.innerHTML = '';
      this.renderer.setStyle(this.txtContent.nativeElement, 'color', 'black');
      this.renderer.setStyle(this.txtContent.nativeElement, 'font-style', 'normal');
      this.renderer.setStyle(this.txtContent.nativeElement, 'font-weight', 'bold');
    }
  }

  selectLabel() {
    this.statusAssignLabel? this.statusAssignLabel = false: this.statusAssignLabel = true; 
  }

  getValuesOfLabel(even: any, label: labelFormat) {
    if(even.target) {
      this.labelAssignId = label.id!;
      this.labelAssignName = label.nameLabel!;
      this.labelAssignColor = label.colorLabel!;
      this.txtAssignLabel.nativeElement.innerHTML = label.nameLabel;
      this.renderer.setStyle(this.txtAssignLabel.nativeElement, 'color', 'black');
      this.renderer.setStyle(this.txtAssignLabel.nativeElement, 'font-weight', 'bold');
      this.renderer.setStyle(this.bookmarkLabel.nativeElement, 'color', 'black');
      this.renderer.setStyle(this.bookmarkLabel.nativeElement, 'font-weight', 'bold');
      this.renderer.setStyle(this.bookmarkLabel.nativeElement, 'color', label.colorLabel);
      this.renderer.setStyle(this.bookmarkLabel.nativeElement, 'border-radius', '0.3rem');
    }
    this.statusAssignLabel = false;    
  }

  saveNewNote() {
    const titleContent = this.titleContent.nativeElement.value;
    const txtContent = this.txtContent.nativeElement.value;
    if((titleContent === 'TITULO' || titleContent === '') &&(txtContent === 'CONTENIDO' || titleContent === '')) {
      console.log(titleContent);
      this.msgError.nativeElement.innerHTML = 'Debes llenar los campos';
    } else if (txtContent === 'CONTENIDO' || txtContent === ''){
      this.msgError.nativeElement.innerHTML = 'Debes ingresar el contenido';
    } else if (titleContent === 'TITULO' || titleContent === ''){
      this.msgError.nativeElement.innerHTML = 'Debes ingresar el titulo';
    } else {
             this.newNote = {
        idUser: this.currUser,
        category: {
          id: this.labelAssignId === undefined? 'N/A' : this.labelAssignId,
          nameLabel: this.labelAssignName === undefined? 'N/A' : this.labelAssignName,
          colorLabel: this.labelAssignColor === undefined? 'transparent' : this.labelAssignColor,
        },
        title: titleContent,
        contNote: txtContent,
        status: {
          archived: false,
          trash: false,
        }
      } 
      this.statusNewStickyNote = false;
      this.service.addDataNotes(this.newNote); 
    }       
  }

  closeCreatedNote() {
    this.statusAssignLabel = false;
    this.statusNewStickyNote = false;
  }

  ngAfterViewInit(): void { }

}
