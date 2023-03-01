import {Component, HostListener, OnInit} from '@angular/core';
import {LocalStorageService} from "../../Services/localStorage.service";
import {CollaboratorService} from "../../Services/collaborator.service";
import {ScrumTeam} from "../../models/ScrumTeam";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ScrumTeamService} from "../../Services/scrum-team.service";
import {MatDialog} from "@angular/material/dialog";
import {
  InvitationsConfirmationDialogComponent
} from "../invitations-confirmation-dialog/invitations-confirmation-dialog.component";
import {animate, style, transition, trigger} from "@angular/animations";
@Component({
  selector: 'app-team-invitaions',
  templateUrl: './team-invitaions.component.html',
  styleUrls: ['./team-invitaions.component.css'],
  animations: [
    trigger('animSlider', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))]),
    ]),
    trigger('inputSlider', [
      transition(':enter',  [style({ width: '0' }), animate('.2s ease-out', style({ width:'80%' }))]),
      transition(':leave',  [style({ width: '80%' }), animate('.2s ease-out', style({ width:'0' }))]),
    ])
  ]
})
export class TeamInvitaionsComponent implements OnInit {
  showSearch :boolean = false;
  search: string;
  currentTeam!:ScrumTeam;
  invitaions: any[] = [];
  disableButtons: boolean = false;
  loading: boolean = true;

  constructor(private dialog: MatDialog,private scrumTeamService: ScrumTeamService, private localStorageService: LocalStorageService, private collabService: CollaboratorService,private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.collabService.getCurrentScrumTeam(parseInt(this.localStorageService.getFromLocalStorage().memberId)).subscribe((st:any)=>{
      this.currentTeam = st;
      this.collabService.getInvitattionsByCollabId(parseInt(this.localStorageService.getFromLocalStorage().memberId)).subscribe((r:any)=>{
        this.invitaions = r;
        this.loading = false;
      })
    })
  }

  focus() {
    this.search = '';
    setTimeout(()=>{
      document.getElementById("searchInput").focus();
    },10)
  }

  leaveTeam() {
    if(this.disableButtons)
      return;
    this.disableButtons = true;
    const dialogRef = this.dialog.open(InvitationsConfirmationDialogComponent, {
      width: '400px',
      height: '380',
      data: 'Are you sure you want to leave your current team ?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scrumTeamService.removeCollabFromTeam(this.currentTeam.id, parseInt(this.localStorageService.getFromLocalStorage().memberId)).subscribe(() => {
          this.currentTeam = new ScrumTeam()
          this.currentTeam.id = null;
          this._snackBar.open("Scrum team exited successfully !", "Close", {
            duration: 5000
          });
          this.disableButtons = false;
        })
      } else {
        this.disableButtons = false;
      }
    });
  }

  declineInvite(jt: any) {
    if(this.disableButtons)
      return;
    this.disableButtons = true;
    const dialogRef = this.dialog.open(InvitationsConfirmationDialogComponent, {
      width: '400px',
      height: '380',
      data: 'Are you sure you want to decline this invitation ?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collabService.cancelInvite(jt.id).subscribe(() => {
          if(document.getElementById("searchInput") != document.activeElement && this.showSearch){
            this.search = '';
            this.showSearch = false;
          }
          this.invitaions.splice(this.invitaions.indexOf(jt), 1);
          this._snackBar.open("Invitaion declined successfully !", "Close", {
            duration: 5000
          });
          this.disableButtons = false;
        });
      } else {
        this.disableButtons = false;
      }
    });
  }

  acceptInvite(jt: any) {
    if(this.disableButtons)
      return;
    this.disableButtons = true;
    if(this.currentTeam.id == null)
      this.accept(jt);
    else{
      const dialogRef = this.dialog.open(InvitationsConfirmationDialogComponent, {
        width: '400px',
        height: '380',
        data: 'Accepting this invitation will remove you from your current team, are you sure you want to proceed ?'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.accept(jt);
        } else {
          this.disableButtons = false;
        }
      });
    }
  }
  accept(jt:any) {
    this.collabService.accpetInvitaion(jt.id).subscribe((r:any)=>{
      if(document.getElementById("searchInput") != document.activeElement && this.showSearch){
        this.search = '';
        this.showSearch = false;
      }
      this.invitaions.splice(this.invitaions.indexOf(jt),1);
      this.currentTeam = r;
      this._snackBar.open("Invitaion accepted successfully !", "Close",  {
        duration: 5000
      });
      this.disableButtons = false;
    })
  }
}
