import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.css',
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']
})
export class ProjectCreationComponent implements OnInit {

  modalVisibility : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
