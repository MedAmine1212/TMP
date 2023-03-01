import {Component, Inject, OnInit} from '@angular/core';
import {functionalrequirement} from "../../models/functionalrequirement";
import {collaborator} from "../../models/Collaborator";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FunctionnallistComponent} from "../functionnallist/functionnallist.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {version} from "../../models/version";
import {FunctionalRequirementService} from "../../Services/functional-requirement.service";

@Component({
  selector: 'app-add-function-req-modal',
  templateUrl: './add-function-req-modal.component.html',
  styleUrls: ['./add-function-req-modal.component.css']
})
export class AddFunctionReqModalComponent implements OnInit {
  funcToAdd: functionalrequirement = new functionalrequirement();
  currentUser: collaborator;
  estW: number = 0;
  estD: number = 0;
  estH: number = 0;
  estM: number = 0;
  updating: boolean = false;
  private estimated: number = 0;
  parent: functionalrequirement;
  private funcListInstance: FunctionnallistComponent;
  version: number;

  constructor(private funcReqService:FunctionalRequirementService,private _snackBar: MatSnackBar,public dialogRef: MatDialogRef<AddFunctionReqModalComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
    this.funcToAdd.title = "";

    this.funcToAdd.description = '';
    this.currentUser = this.data[0];
    this.parent = this.data[1];
    this.version = this.data[2];
  }

  check(event, multiplier) {
    if(event.srcElement.value < 0) {
      event.srcElement.value = 0;
      this._snackBar.open("Minimum value is 0 !", "Close",  {
        duration: 2000
      });
      return false;
    }
    if(event.srcElement.value == '') {
      if(multiplier == 1)
        this.estM = 0;

      if(multiplier == 60)
        this.estH = 0;

      if(multiplier == 480)
        this.estD = 0;

      if(multiplier == 2400)
        this.estW = 0;
      return true;
    }
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
    return true;
  }

  updateEstimated($event: Event, multiplier: number) {
    if(!this.check(event, multiplier)) {
      return
    } else {
      this.estimated = this.estW*2400+this.estD*480+this.estH*60+this.estM;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
  createEx() {
    if(this.updating)
      return
    if(this.estimated == 0) {
      this._snackBar.open("Estimation required !", "Close",  {
        duration: 2000
      });
      return
    }
    if(this.funcToAdd.title == '') {
      this._snackBar.open("Title required !", "Close",  {
        duration: 2000
      });
      return
    }
    if(this.funcToAdd.title == '') {
      this._snackBar.open("Description required !", "Close",  {
        duration: 2000
      });
      return
    }
    this.updating = true;
    this.funcToAdd.version = this.version+"";
    this.funcToAdd.author = this.currentUser;
    if(this.parent != null)
      this.funcToAdd.parentId = this.parent.id+"";
    else
      this.funcToAdd.parentId = null;
    this.funcToAdd.estimationTime = this.estimated;
    this.funcReqService.addFr(this.version, this.funcToAdd).subscribe((r:functionalrequirement)=>{
      r.functional_requirements = [];
      this.dialogRef.close([true,r],);
      this.updating = false;
    })
  }
}
