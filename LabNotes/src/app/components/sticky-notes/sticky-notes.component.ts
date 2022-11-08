import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ServicesService } from '../../services.service';
import NotesFormat from '../../interfaces/notes.interface';

@Component({
  selector: 'app-sticky-notes',
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.css']
})
export class StickyNotesComponent implements OnInit {

  @ViewChild('titleContent') titleContent!: ElementRef;
  @ViewChild('txtContent') txtContent!: ElementRef;

  showEditOptions: boolean = false;
  currUser: any = this.service.getCurrUser();
  notesByUser: Array<any> = []

  constructor(
    private renderer: Renderer2,
    private service: ServicesService,
  ) { }

  ngOnInit(): void {
    this.service.getDataNotesByUser(this.currUser).subscribe((notes) => {
      this.notesByUser = notes;
      console.log(this.notesByUser);
    });
  }

showModalEditNoteOptions() {
  this.renderer.removeAttribute(this.titleContent.nativeElement, 'readonly');
  this.renderer.addClass(this.titleContent.nativeElement, 'editNotes');
  this.renderer.removeAttribute(this.txtContent.nativeElement, 'readonly');
  this.renderer.addClass(this.txtContent.nativeElement, 'editNotes');

  /* MANDA EL CURSOR AL FINAL DEL TEXTO EN EL TITULO */
  const elemLength = this.titleContent.nativeElement.value.length;
  if(this.titleContent.nativeElement.setSelectionRange) {
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

acceptEditNote() {
  this.renderer.setAttribute(this.titleContent.nativeElement, 'readonly', 'true');
  this.renderer.removeClass(this.titleContent.nativeElement, 'editNotes');
  this.renderer.setAttribute(this.txtContent.nativeElement, 'readonly', 'true');
  this.renderer.removeClass(this.txtContent.nativeElement, 'editNotes');

  this.showEditOptions = false;
}
cancelEditNote() {
  this.renderer.removeAttribute(this.titleContent.nativeElement, 'readonly');
  this.renderer.removeClass(this.titleContent.nativeElement, 'editNotes');
  this.renderer.removeAttribute(this.txtContent.nativeElement, 'readonly');
  this.renderer.removeClass(this.txtContent.nativeElement, 'editNotes');

  this.showEditOptions = false;
}
}

/* function setCaretPosEnd(ctrl) {
      var varCtlLen = ctrl.value.length;
      // For Most Web Browsers
      if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(varCtlLen, varCtlLen);
      // IE8 and below
      } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', varCtlLen);
        range.moveStart('character', varCtlLen);
        range.select();
      }
    }*/