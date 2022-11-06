import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../../services.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private service: ServicesService,
    private router: Router
    ) { }

  statusAsignLabel: boolean = false;
  modalNewLabel: boolean = false;

  ngOnInit(): void {

  }

  showModalLabels() {
    this.statusAsignLabel? this.statusAsignLabel = false: this.statusAsignLabel = true;
    console.log(this.statusAsignLabel);
    this.service.$showModelStickyNote.emit(false);
  }

  createStickyNote() {
    this.statusAsignLabel = false;
    this.service.$showModelStickyNote.emit(true);
    this.service.$showModalChangeNickname.emit(false);
  }

  signOut() {
    this.service.singOutUser()
    .then(() => this.router.navigate(['/login']));
  }

  showModalNewLabel() {
    this.statusAsignLabel? this.statusAsignLabel = false: this.statusAsignLabel = true;
    this.modalNewLabel = true;
  }

  saveNewLabel() {
    this.modalNewLabel = false;
  }

  closeModalNewLabel() {
    this.modalNewLabel = false;
  }
  ngAferViewInit () {  }
}
