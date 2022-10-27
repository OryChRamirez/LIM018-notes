import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../../services.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private service: ServicesService, private router: Router) { }

  ngOnInit(): void {
  }

  signOut() {
    this.service.singOutUser();
    this.router.navigate(['/login']);
  }
}
