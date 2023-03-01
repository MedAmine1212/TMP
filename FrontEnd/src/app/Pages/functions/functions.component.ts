import {Component, Input, OnInit} from '@angular/core';
import {functionalrequirement} from "../../models/functionalrequirement";
import {FunctionnallistComponent} from "../functionnallist/functionnallist.component";
import {AddFunctionReqModalComponent} from "../add-function-req-modal/add-function-req-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  InvitationsConfirmationDialogComponent
} from "../invitations-confirmation-dialog/invitations-confirmation-dialog.component";
import {FunctionalRequirementService} from "../../Services/functional-requirement.service";

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent implements OnInit {
  @Input() exigencs:functionalrequirement [];
  @Input() number:string;
  @Input() level:number;
  parent:FunctionnallistComponent;
  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar, private funcReqService: FunctionalRequirementService) {
    this.parent = FunctionnallistComponent.instance;
  }

  ngOnInit(): void {
  }

  addFunctionalReq(ex:functionalrequirement) {
    const dialogRef = this.dialog.open(AddFunctionReqModalComponent, {
      data: [this.parent.currentUser,ex,this.parent.version]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        ex.functional_requirements.push(result[1]);
        this._snackBar.open("Functional requirement added successfully !", "Close",  {
          duration: 2000
        });
      }
    });
  }

  deleteFr(ex: functionalrequirement) {
    const dialogRef = this.dialog.open(InvitationsConfirmationDialogComponent, {
      width: '400px',
      height: '380',
      data: "Are you sure you want to delete this functional requirement ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let del = true;
        const index = this.exigencs.indexOf(ex);
        this.exigencs.splice(this.exigencs.indexOf(ex),1);
        const snack = this._snackBar.open("Functional requirement deleted successfully !", "Undo",  {
          duration: 2000
        });
        snack.onAction().subscribe(()=> {
          del = false;
          this.exigencs.splice(index,index-1,ex);
        });
        snack.afterDismissed().subscribe(()=>{
          if(del) {
            this.funcReqService.deleteFr(ex.id).subscribe();
          }
        })
      }
    });
  }
}
