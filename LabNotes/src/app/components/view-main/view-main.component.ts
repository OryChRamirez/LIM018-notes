import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services.service';

@Component({
  selector: 'app-view-main',
  templateUrl: './view-main.component.html',
  styleUrls: ['./view-main.component.css']
})
export class ViewMainComponent implements OnInit {

  constructor(private service: ServicesService) { }

  ngOnInit(): void {
  }

}
