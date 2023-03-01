import { Component, OnInit } from '@angular/core';
import { project } from 'src/app/models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { VersionService } from 'src/app/Services/version.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css',
    '../../../assets/css/bootstrap.min.css',
    '../../../assets/font-awesome/css/font-awesome.css',
    '../../../assets/css/animate.css'
  ],
  providers: [DatePipe]
})
export class VersionsComponent implements OnInit {

  addVisibility: boolean = true;
  modifVisibility: boolean = true;
  listViewStatus : boolean = false;
  gridViewStatus : boolean = true;
  showFunctionalneeds : boolean = true;
  hideSelection : boolean = true;
  hideVersions : boolean= true;
  projects : project[]= [];
  selectedProject : number = null;
  selectedVersion : number;
  selectedVersion2 : number;
  modifVersionId : number;
  versions2: any;
  versionForm = new FormGroup({
    number: new FormControl('')
  });
  versions= [{
    "id":1,
    "versionName" :"Version 1", //concat of 'version and number'
    "numberOfRequirements":"Prototype",
    "starting_Date" : "December 10, 2020",
    "color":"#dbf6fd",
    "darkerShade":"#096c86"
  },
  {
    "id":2,
    "versionName" :"Version 2",
    "numberOfRequirements":"Prototype",
    "starting_Date" : "December 10, 2020",
    "color":"#dbf6fd",
    "darkerShade":"#096c86"
  },
  {
    "id":3,
    "versionName" :"version 3",
    "numberOfRequirements":"Prototype",
    "starting_Date" : "December 10, 2020",
    "color":"#dbf6fd",
    "darkerShade":"#096c86"
  },
  {
    "id":4,
    "versionName" :"UI Development",
    "numberOfRequirements":"Prototype",
    "starting_Date" : "December 10, 2020",
    "color":"#dbf6fd",
    "darkerShade":"#096c86"
  },
  {
    "id":5,
    "versionName" :"Data Analysis",
    "numberOfRequirements":"Prototype",
    "starting_Date" : "December 10, 2020",
    "color":"#dbf6fd",
    "darkerShade":"#096c86"
  },
  {
    "id":6,
    "versionName" :"Web Designing",
    "numberOfRequirements":"Prototype",
    "starting_Date" : "December 10, 2020",
    "color":"#dbf6fd",
    "darkerShade":"#096c86"
  }
]

  myDate = new Date();
  todayDate: string = "";

  constructor(
    private projectService : ProjectService, 
    private versionService : VersionService, 
    private fb : FormBuilder, 
    private datePipe: DatePipe
    ) { }

  ngOnInit(): void {
    console.log('versions componenent');
    console.log(this.versions[0].versionName);
    this.getAllProjects();
    this.todayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }
  private initForm(){
    this.versionForm = this.fb.group({
      number:['',Validators.required],
    })
  }

  //pass in true or false accordingly
  toggleAddVisibility(val: boolean){
    this.addVisibility = val;
  }

  addVersion(){
    if(!this.showFunctionalneeds){
      this.showFunctionalneeds= true;
    }
    this.toggleAddVisibility(false);
  }

  confirmAdd(){
    
    let formData = new FormData();
    formData.append('number', this.versionForm.get('number').value);
    this.versionService.addVersion(formData,this.selectedVersion).subscribe((res)=>{console.log(res);
      this.versions2.push(res);});
    this.toggleAddVisibility(true);
  }

  modifVersion(id:number, versionNumber : string){
    if(!this.showFunctionalneeds){
      this.showFunctionalneeds= true;
    }
    this.modifVisibility = false;
    this.toggleAddVisibility(false);
    this.versionForm.patchValue({number : versionNumber});
    this.modifVersionId = id;
  }

  confirmModif(){
    let formData = new FormData();
    formData.append('number', this.versionForm.get('number').value);
    this.versionService.editVersion(this.versionForm.get('number').value,this.modifVersionId).subscribe();
    for(let version of this.versions2){
      if (version.id == this.modifVersionId){
        version.number =this.versionForm.get('number').value;
        break;
      }
    }
    this.modifVisibility = true;
    this.toggleAddVisibility(true);
    this.initForm();
  }
  listEvent(){
    this.listViewStatus = true;
    this.gridViewStatus = false;
  }
  gridEvent(){
    this.listViewStatus = false;
    this.gridViewStatus = true;
  }
  getFunctionalneeds(id :number){
    this.showFunctionalneeds=false;
    this.selectedVersion2=id;
  }
  onChoiceClick(event){
    const value = event.target.value;
    this.selectedProject = value;
    this.hideVersions= false;
    this.hideSelection = false;
    this.versionService.getAllVersions(this.selectedProject).subscribe((res)=>{
    this.versions2= res});
  }

  getAllProjects(){
    this.projectService.getProjects().subscribe((res)=>{
    this.projects= res});
  }
  onVersionChange(event){
    const value = event.value;
    this.selectedVersion = value;
  }
  deleteVersion(id :number){
    this.versionService.deleteVersion(id).subscribe();
    for(let version of this.versions2){
      if (version.id == this.modifVersionId){
        this.versions2.splice(this.versions2.indexOf(version),1);
        break;
      }
    }
  }
  

}
