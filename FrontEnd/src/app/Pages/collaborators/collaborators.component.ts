import {Component, HostListener, OnInit} from '@angular/core';
import {collaborator} from "../../models/Collaborator";
import {ScrumTeam} from "../../models/ScrumTeam";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ScrumTeamService} from "../../Services/scrum-team.service";
import {CollaboratorService} from "../../Services/collaborator.service";
import {JoinTeam} from "../../models/JoinTeam";


@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.css'],
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
export class CollaboratorsComponent implements OnInit {
  cols: collaborator [] = [];
  pendingCollabs: JoinTeam [] = [];
  allCollabs: collaborator [] = [];
  teams: ScrumTeam[] = [];
  loading :boolean = true;
  showAddForm: boolean = false;
  stayOn: boolean = false;
  disableButtons:boolean = false;
  inviteTeam!: number;
  error: string = "";
  toAssign!: collaborator;
  showTeamError: boolean = false;
  assignedRole: string = "Development team";
  searchActive: string = "";
  searchNonActive: string = "";
  searchPending: string = "";
  showSearchActive: boolean = false;
  showSearchPending: boolean = false;
  showSearchNonActive: boolean = false;
  saving: boolean = false;

  constructor(private _snackBar: MatSnackBar, private scrumTeamService: ScrumTeamService, private collabService: CollaboratorService) { }

  ngOnInit(): void {
    // @ts-ignore
    this.inviteTeam = -1;
    this.scrumTeamService.getAllScrumTeams().subscribe((r:any)=>{
      this.teams = r;
      this.pendingCollabs = [];
      for(let t of this.teams) {
        let keep = [];
        for(let jt of t.joinTeam) {
          if(jt.status == 0){
            const tt = new ScrumTeam();
            tt.name = t.name;
            jt.collaborator.team = tt;
            this.pendingCollabs.push(jt);
          } else if(jt.status == 1){
            keep.push(jt);
          }
        }
          t.joinTeam = keep;
      }
      this.collabService.getAllCollabs().subscribe((r2:any)=>{
        this.allCollabs = r2;
        setTimeout(()=>{
          this.loading = false;
        },100);
      })
    });

  }

  cancelInvite() {
    // @ts-ignore
    this.inviteTeam = -1
    this.error = "";
    this.saving = false;
    this.showTeamError = false;
    this.showAddForm = false;
    this.assignedRole = "Development team";
    this.stayOn = false;
    // @ts-ignore
    this.toAssign = null;
  }


  @HostListener('window:click', ['$event'])
  clickEvent(event:MouseEvent) {
    setTimeout(()=>{
      if(!this.stayOn) {
        this.cancelInvite();
        this.stayOn = false;
      } else {
        this.stayOn = false;
      }
      if(document.getElementById("inputActive") != document.activeElement && this.showSearchActive){
        this.searchActive = '';
        this.showSearchActive = false;
      }
      if(document.getElementById("inputPending") != document.activeElement && this.showSearchPending) {
        this.searchPending = '';
        this.showSearchPending = false;
      }
      if(document.getElementById("inputNonActive") != document.activeElement && this.showSearchNonActive) {
        this.searchNonActive = '';
        this.showSearchNonActive = false;
      }
    },10);

  }
clearInputs() {
    this.searchActive = '';
    this.searchPending = '';
    this.searchNonActive = '';
}
@HostListener('window:keydown', ['$event'])
  keyEvent(event:KeyboardEvent) {
  if(event.key == "Escape") {
    this.cancelInvite();
  }
}

  deleteInvitaion(jt:any) {
    if(this.disableButtons) {
      return;
    }
    this.disableButtons = true;
    this.collabService.cancelInvite(jt.id).subscribe(()=>{
      this.pendingCollabs.splice(this.pendingCollabs.indexOf(jt),1);
      this._snackBar.open("Invitation removed successfully !", "Close",  {
        duration: 5000
      });
      this.disableButtons = false;
    });
  }

  removeFromTeam(jt: any, st:ScrumTeam) {
    if(this.disableButtons) {
      return;
    }
    this.disableButtons = true;
    this.scrumTeamService.removeCollabFromTeam(st.id,jt.collaborator.id).subscribe(()=>{
      st.joinTeam.splice(st.joinTeam.indexOf(jt),1);
      this._snackBar.open("Collaborator removed from their current team !", "Close",  {
        duration: 5000
      });
      this.disableButtons = false;
    })
  }

  assginToATeam(ac: collaborator) {
    if(this.disableButtons) {
      return;
    }
    this.toAssign = ac;
    this.stayOn = true;
    this.showAddForm = true;
  }

  assignToTeam() {
    this.showTeamError = false;
    if(this.saving) {
      return;
    }
    if(this.inviteTeam == -1) {
      this.showTeamError = true;
      return;
    }
    this.saving = true
    this.toAssign.role = this.assignedRole;
    this.scrumTeamService.assignCollabToTeam(this.toAssign.id, this.inviteTeam, this.toAssign.role).subscribe((r:any)=>{
      if(r.id != null) {
      for(let st of this.teams) {
        if(st.id == this.inviteTeam) {
          const tt = new ScrumTeam();
          tt.name = st.name;
          r.collaborator.team = tt;
          break;
        }
      }
        this.pendingCollabs.unshift(r);
        this.cancelInvite();
        this._snackBar.open("Invitation sent to collaborator successfully !", "Close",  {
          duration: 5000
        });
      } else {
        this._snackBar.open("Collaborator already assigned or have a pending invitation to this team !", "Close",  {
          duration: 5000
        });
        this.error = "";
        this.saving = false;
        this.showTeamError = false;
      }
    });
  }

  focus(id: string) {
    this.clearInputs();
    setTimeout(()=>{
      document.getElementById(id).focus();
    },10)
  }
}
