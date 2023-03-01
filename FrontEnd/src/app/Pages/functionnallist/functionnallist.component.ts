import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import {ActivatedRoute} from "@angular/router";
import {functionalrequirement} from "../../models/functionalrequirement";
import {HttpClient} from "@angular/common/http";
import {FunctionalRequirementService} from "../../Services/functional-requirement.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {min} from "rxjs";
import {LoginService} from "../../Services/login.service";
import {collaborator} from "../../models/Collaborator";
import {MatDialog} from "@angular/material/dialog";
import {AddFunctionReqModalComponent} from "../add-function-req-modal/add-function-req-modal.component";
import {TimeConverterService} from "../../Services/time-converter.service";
import {LocalStorageService} from "../../Services/localStorage.service";

@Component({
  selector: 'app-functionnallist',
  templateUrl: './functionnallist.component.html',
  styleUrls: ['./functionnallist.component.css','../../../assets/css/bootstrap.min.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']
})

export class FunctionnallistComponent implements OnInit {

  isLoading: boolean = true;
  exigences: functionalrequirement[] = [];

  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion;
  version!:number;
  modalVisibility : boolean = true;
  elapM:number = 0;
  elapH:number = 0;
  elapD:number = 0;
  elapW:number = 0;
  estM:number = 0;
  estH:number = 0;
  estD:number = 0;
  estW:number = 0;
  clicked!: functionalrequirement;
  static instance:FunctionnallistComponent;
  modalTitle: string = "";
  modalDescription: string = "";
  updating: boolean = false;
  private estimated: number;
  private elapsed: number;
  currentUser!: collaborator;
  collaborators: any;
  constructor(private localStorage: LocalStorageService, private timeConverter: TimeConverterService, private dialog: MatDialog,private loginS: LoginService, private route: ActivatedRoute, private http: HttpClient, private FRS: FunctionalRequirementService, private _snackBar: MatSnackBar) {
    FunctionnallistComponent.instance = this;
    this.version = parseInt(this.route.snapshot.paramMap.get('idVerson'));
    this.currentUser = new collaborator();
    this.currentUser.id = parseInt(this.localStorage.getFromLocalStorage().memberId);
    this.currentUser.fullName = this.localStorage.getFromLocalStorage().fullName;
    this.currentUser.memberType = parseInt(this.localStorage.getFromLocalStorage().memberType);
  }


  handleEventClick(){
    this.modalVisibility = false;
  }
  ngOnInit(): void {
    this.isLoading = true ;
    this.loadFr().then(()=>{
      setTimeout(()=>{
        this.isLoading = false;
      },1000);
    });
  }

  async loadFr() {
    this.FRS.getFunctionalRequirements(this.version).subscribe(data => {
      this.exigences = [];
      this.exigences = data;
    }, error => console.log(error));
  }

  updateEx() {
    if(this.modalTitle != this.clicked.title || this.modalDescription != this.clicked.description || this.estimated != this.clicked.estimationTime || this.elapsed != this.clicked.elapsedTime) {
      if(this.clicked.title == "") {
        this._snackBar.open("Title can't be empty !", "Close",  {
          duration: 3000
        });
        return;
      }
      this.updating = true;
      this.FRS.updateFunctionRequirement({'title':this.clicked.title, 'description': this.clicked.description, 'elapsedTime':this.elapsed,'estimationTime':this.estimated},this.clicked.id).subscribe(()=>{
        this.clicked.estimationTime = this.estimated;
        this.clicked.elapsedTime = this.elapsed;
        this.modalVisibility = true;
        this.updating = false;
        this._snackBar.open("Update successfull !", "Close",  {
          duration: 3000
        });
      },error=>console.log(error));
    } else {
      this._snackBar.open("Nothing to update ", "Close",  {
        duration: 3000
      });
    }
  }

  check(event, multiplier, caller) {
    if(event.srcElement.value < 0) {
      event.srcElement.value = 0;
      this._snackBar.open("Minimum value is 0 !", "Close",  {
        duration: 2000
      });
      return false;
    }
    if(event.srcElement.value == '') {
      if(multiplier == 1)
         caller ? this.elapM = 0 :this.estM = 0;

      if(multiplier == 60)
        caller ? this.elapH = 0 :this.estH = 0;

      if(multiplier == 480)
        caller ? this.elapD = 0 :this.estD = 0;

      if(multiplier == 2400)
        caller ? this.elapW = 0 :this.estW = 0;
      return true;
    }
    if(caller) {

      if(this.elapM > 59) {
        while (this.elapM >= 60) {
          this.elapH++;
          this.elapM -=60;
        }
      }
      if(this.elapH > 8) {
        while (this.elapH >= 8) {
          this.elapD++;
          this.elapH -=8;
        }
      }
      if(this.elapD > 5) {
        while (this.elapD >= 5) {
          this.elapW++;
          this.elapD -=5;
        }
      }
    } else {
      if(this.estM > 59) {
        while (this.estM >= 60) {
          this.estH++;
          this.estM -=60;
        }
      }
      if(this.estH > 8) {
        while (this.estH >= 8) {
          this.estD++;
          this.estH -=8;
        }
      }
      if(this.estD > 5) {
        while (this.estD >= 5) {
          this.estW++;
          this.estD -=5;
        }
      }
    }
    return true;
  }
  updateELapsed(event, multiplier:number) {
    if(!this.check(event, multiplier, true)) {
      return;
    } else {
      this.elapsed = this.elapW*2400+this.elapD*480+this.elapH*60+this.elapM;
    }
  }

  updateEstimated(event, multiplier: number) {
    if(!this.check(event, multiplier, false)) {
      return
    } else {
      this.estimated = this.estW*2400+this.estD*480+this.estH*60+this.estM;
    }
  }

  setClicked(ex: functionalrequirement) {
    this.modalVisibility = false;
    this.clicked = ex;
    this.modalTitle = ex.title
    this.modalDescription = ex.description;
    this.estimated = ex.estimationTime;
    this.elapsed = ex.elapsedTime;
    this.elapM = this.timeConverter.getMinutes(ex.elapsedTime);
    this.elapH = this.timeConverter.getHours(ex.elapsedTime);
    this.elapD = this.timeConverter.getDays(ex.elapsedTime);
    this.elapW = this.timeConverter.getWeeks(ex.elapsedTime);
    this.estM = this.timeConverter.getMinutes(ex.estimationTime);
    this.estH = this.timeConverter.getHours(ex.estimationTime);
    this.estD = this.timeConverter.getDays(ex.estimationTime);
    this.estW = this.timeConverter.getWeeks(ex.estimationTime);
  }

  cancel() {
    this.clicked.title = this.modalTitle;
    this.clicked.description = this.modalDescription;
    this.modalVisibility = true;
  }

  addFunctionalReq() {
    const dialogRef = this.dialog.open(AddFunctionReqModalComponent, {
      data: [this.currentUser,null,this.version]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.exigences.push(result[1]);
        this._snackBar.open("Functional requirement added successfully !", "Close",  {
          duration: 2000
        });
      }
    });
  }

  getStringTime(estimationTime: number) {
    return this.timeConverter.getStringTime(estimationTime);
  }
}
