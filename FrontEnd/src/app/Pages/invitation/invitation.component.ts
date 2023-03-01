import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { collaborator } from 'src/app/models/Collaborator';
import { CollaboratorService } from 'src/app/Services/collaborator.service';
@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {

  inviteVisibility: boolean = true;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private collaboratorService: CollaboratorService, private router: Router
  ) { }
  collaborators: any;


  ngOnInit(): void {
    this.collaboratorService.getCollaborators().subscribe(data => {
      this.collaborators = data;
      console.log(data);
    })


  }


  sendInvitationForm = this.formBuilder.group({

    email: ['', [
      Validators.required,
      Validators.email

    ]],



  });
  get f() { return this.sendInvitationForm.controls; }



  invite(email: any) {
    const formData = new FormData();
    if (!email)
      formData.append('reciever', this.sendInvitationForm.value.email);
    else
      formData.append('reciever', email);



    this.collaboratorService.sendEmailInvitation(formData).subscribe({
      next: (v) => {
        this.snackBar.open("Invitation sent.", "Close", {
          duration: 5000
        });
      },
      error: (e) => {
        if (e.status == 400)
          this.snackBar.open("Account exist", "Close", {
            duration: 5000
          });
        console.error("error :" + e);

      },
      complete: () => { this.inviteVisibility = true; this.ngOnInit() }

    });

  }
  delete(id: number, action: boolean) {
    this.collaboratorService.deleteCollaborator(id).subscribe({
      next: (v) => {
        if (action)
          this.snackBar.open("Collaborator deleted", "Close", {
            duration: 5000
          });
        else
          this.snackBar.open("Invitation canceled", "Close", {
            duration: 5000
          });
      },
      error: (e) => {
        if (e.status == 404)
          this.snackBar.open("Account not found ", "Close", {
            duration: 5000
          });
        console.error("error :" + e);

      },
      complete: () => { this.ngOnInit() }

    });



  }


}


