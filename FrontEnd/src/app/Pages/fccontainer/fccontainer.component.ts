import { ExigencesComponent } from './../exigences/exigences.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fccontainer',
  templateUrl: './fccontainer.component.html',
  styleUrls: ['./fccontainer.component.css']
})
export class FccontainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  toggleShow(){
    if( ExigencesComponent.instance != null)
    ExigencesComponent.instance.toggleShow();
  }
  getButtonName(){
    if( ExigencesComponent.instance != null)
    return ExigencesComponent.instance.buttonName;
  }

}
