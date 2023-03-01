import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css',
  '../../../../assets/css/bootstrap.min.css',
  '../../../../assets/font-awesome/css/font-awesome.css',
  '../../../../assets/css/animate.css',
  '../../../../assets/css/style.css']
})
export class SidebarComponent {

  projectsVisibility : boolean = true;
  teamsVisibility : boolean = true;

  constructor() { }

}
