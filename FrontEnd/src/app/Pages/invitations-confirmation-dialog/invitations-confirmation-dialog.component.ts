import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-invitations-confirmation-dialog',
  templateUrl: './invitations-confirmation-dialog.component.html',
  styleUrls: ['./invitations-confirmation-dialog.component.css']
})
export class InvitationsConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<InvitationsConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
