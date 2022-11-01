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

  ngOnInit(): void {

  }

  showModalLabels() {
    this.statusAsignLabel? this.statusAsignLabel = false: this.statusAsignLabel = true;
    console.log(this.statusAsignLabel);
    
  }

  createStickyNote() {
    this.service.$showModelStickyNote.emit(true);
  }

  signOut() {
    this.service.singOutUser();
    this.router.navigate(['/login']);
  }
}
