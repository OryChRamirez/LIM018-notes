import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  HostListener,
} from '@angular/core';
import labelFormat from 'src/app/interfaces/labels.interface';
import NotesFormat from 'src/app/interfaces/notes.interface';
import { ServicesService } from '../../services.service';

@Component({
  selector: 'app-sticky-notes',
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.css'],
})
export class StickyNotesComponent implements OnInit {
  @ViewChild('titleContent') titleContent!: ElementRef;
  @ViewChild('txtContent') txtContent!: ElementRef;
  @ViewChild('txtAssignLabel') txtAssignLabel!: ElementRef;
  @ViewChild('colorAssignLabel') colorAssignLabel!: ElementRef;
  @ViewChild('bookmarkLabel') bookmarkLabel!: ElementRef;

  public selecIndex: number = NaN;
  public selecIndex4Label: number = NaN;
  public showEditOptions: boolean = false;
  public currUser: any = this.service.getCurrUser();
  public notesByUser: Array<any> = [];
  public statusAssignLabel: boolean = false;
  public arrLabelsByUser: Array<any> = [];
  labelAssignId!: string;
  labelAssignName!: string;
  labelAssignColor!: string;
  showModalNotification: boolean = false;
  showModalSendToArchived: boolean = false;
  public newDataLabel: NotesFormat = {
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
  txtNotification: string = '';

  constructor(private renderer: Renderer2, private service: ServicesService) {}

  ngOnInit(): void {
    this.service.getDataLabelsByUser(this.currUser!).subscribe((labels) => {
      //TRAE LAS ETIQUETAS DEL USUARIO LOGUEADO
      this.arrLabelsByUser = labels;
      
    });
    this.service.$showFilterNotes.subscribe((valor) =>{
      if(valor.allNotes) {
        this.service.getDataNotesByUser(this.currUser).subscribe((notes) => {
          this.notesByUser = notes;
        });
      } else if(valor.archivedNotes) {
        this.service.getNotesArchivedByUser(this.currUser).subscribe((notes) => {
          this.notesByUser = notes;
        });   
      } else if(valor.trashNotes) {
        this.service.getNotesTrashByUser(this.currUser).subscribe((notes) => {
          this.notesByUser = notes;
        });
      }
    });
  }


  showModalEditNoteOptions(i: number) {
    this.selecIndex = i;
    // /* MANDA EL CURSOR AL FINAL DEL TEXTO EN EL TITULO */
    const elemLength = this.titleContent.nativeElement.value.length;
    if (this.titleContent.nativeElement.setSelectionRange) {
      this.titleContent.nativeElement.focus();
      this.titleContent.nativeElement.setSelectionRange(elemLength, elemLength);
    } else if (this.titleContent.nativeElement.createTextRange) {
      const range = this.titleContent.nativeElement.createTextRange();
      range.moveEnd('character', elemLength);
      range.moveStart('character', elemLength);
      range.select();
    }
    this.showEditOptions = true;
  }
  asiggnLabelModal(i: number) {
    this.selecIndex4Label = i;
    this.statusAssignLabel
      ? (this.statusAssignLabel = false)
      : (this.statusAssignLabel = true);
    console.log(this.statusAssignLabel);
  }

  getValuesOfLabel(even: any, label: labelFormat, idNote: string) {
    if (even.target) {
      this.labelAssignId = label.id!;
      this.labelAssignName = label.nameLabel!;
      this.labelAssignColor = label.colorLabel!;
      this.txtAssignLabel.nativeElement.innerHTML = label.nameLabel;
      this.renderer.setStyle(this.colorAssignLabel.nativeElement ,'color', label.colorLabel);
      this.service.updateLabelInNote(idNote, label);
    }
    this.statusAssignLabel = false;
  }

  acceptEditNote(note: any) {
    const newTitle = this.titleContent.nativeElement.value;
    const newcontNote = this.txtContent.nativeElement.value;
    if(newTitle === '' || newcontNote === '') {
      this.selecIndex = NaN;
      this.showEditOptions = false;
      this.service.getDataNotesByUser(this.currUser).subscribe((notes) => {
        this.notesByUser = notes;
        console.log(this.notesByUser);
      });
    } else {
      this.newDataLabel = {
        id: note.id,
        idUser: this.currUser,
        category: {
          id: note.category.id,
          nameLabel: note.category.nameLabel,
          colorLabel: note.category.colorLabel,
        },
        title: this.titleContent.nativeElement.value,
        contNote: this.txtContent.nativeElement.value,
        status: {
          archived: false,
          trash: false,
        },
      }
      this.service.updateNoteContent(note.id, this.newDataLabel);  
    }    
    this.renderer.setAttribute(
      this.titleContent.nativeElement,
      'readonly',
      'true'
    );
    this.renderer.removeClass(this.titleContent.nativeElement, 'editNotes');
    this.renderer.setAttribute(
      this.txtContent.nativeElement,
      'readonly',
      'true'
    );
    this.renderer.removeClass(this.txtContent.nativeElement, 'editNotes');
    this.selecIndex = NaN;
    this.showEditOptions = false;
  }

  cancelEditNote() {
    this.renderer.removeAttribute(this.titleContent.nativeElement, 'readonly');
    this.renderer.removeClass(this.titleContent.nativeElement, 'editNotes');
    this.renderer.removeAttribute(this.txtContent.nativeElement, 'readonly');
    this.renderer.removeClass(this.txtContent.nativeElement, 'editNotes');
    this.selecIndex = NaN;
    this.showEditOptions = false;
  }

  sendToTrash(idnote: string){
    this.service.sendNoteToTrash(idnote);
    this.showModalNotification = true;
    this.service.getNotesTrashByUser(this.currUser).subscribe((notes) => {
      this.notesByUser = notes;
    });
    this.txtNotification = 'Nota enviada a la papelera';
  }

  sendToArchived(idNote: string){
    this.service.sendNoteToArchive(idNote);
    this.showModalNotification = true;
    this.service.getNotesArchivedByUser(this.currUser).subscribe((notes) => {
      this.notesByUser = notes;
    });
    this.txtNotification = 'Nota enviada Archivo';
  }

  restoreNotesToInitFromTrash(idNote: string) {
    this.service.restoreNotes(idNote);
    this.showModalNotification = true;
    this.service.getDataNotesByUser(this.currUser).subscribe((notes) => {
      this.notesByUser = notes;
    });
    this.txtNotification = 'Se ha enviado la nota al inicio';

  }

  restoreNotesToInitFromArchived(idNote: string) {
    this.service.restoreNotes(idNote);
    this.showModalNotification = true;
    this.service.getDataNotesByUser(this.currUser).subscribe((notes) => {
      this.notesByUser = notes;
    });
    this.txtNotification = 'Se ha enviado la nota al inicio';
  }

  closeModalNotification(){
    this.showModalNotification = false;
  }

  deleteNote(idNote: string){
    this.service.deleteNote(idNote);
    this.showModalNotification = true;
    this.txtNotification = 'Nota eliminada definitivamente';
  }
}
