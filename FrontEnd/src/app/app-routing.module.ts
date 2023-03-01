import { ProfileComponent } from './Pages/profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './Pages/layout/layout.component';
import { VersionsComponent } from './Pages/versions/versions.component';
import { DocumentsComponent } from './Pages/documents/documents.component';
import { AddDocumentComponent } from './Pages/add-document/add-document.component';
import { DetailDocumentComponent } from './Pages/detail-document/detail-document.component';
import { CalendarComponent } from './Pages/calendar/calendar.component';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './Pages/logout/logout.component';
import { InvitationComponent } from './Pages/invitation/invitation.component';
import { FunctionnallistComponent } from './Pages/functionnallist/functionnallist.component';
import { KanbanBoardComponent } from './Pages/kanban-board/kanban-board.component';
import { CollaboratorsComponent } from "./Pages/collaborators/collaborators.component";
import { FccontainerComponent } from './Pages/fccontainer/fccontainer.component';
import { ScrumTeamComponent } from './Pages/scrum-team/scrum-team.component';
import { ProjectCreationComponent } from './Pages/project-creation/project-creation.component';
import { AcceptInvitationTMPComponent } from './Pages/accept-invitation-tmp/accept-invitation-tmp.component';
import { LabelsManagementComponent } from './Pages/labels-management/labels-management.component';
import { BackgroundComponent } from './Pages/home/background/background.component';
import { LoginGuard } from './guards/login.guard';

import { RolesGuard } from './guards/roles.guard';
import {TeamInvitaionsComponent} from "./Pages/team-invitaions/team-invitaions.component";
import {WorkloadComponent} from "./Pages/workload/workload.component";






const routes: Routes = [

  { path: '', redirectTo: 'tmp', pathMatch: 'full' },
  {
    path: 'tmp', canActivate: [AuthGuard], component: LayoutComponent, children: [
      { path: 'functionallist/:idVerson', component: FunctionnallistComponent },
      { path: 'collaborators', component: CollaboratorsComponent },
      { path: 'workload', component: WorkloadComponent },
      { path: 'team', component: ScrumTeamComponent },
      { path: 'functionals', component: FccontainerComponent },
      { path: 'versions', component: VersionsComponent },
      { path: 'teamInvitations', component: TeamInvitaionsComponent },
      { path: 'AddDocuments', component: AddDocumentComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'functionallist', component: FunctionnallistComponent },
      { path: 'DetailDocuments/:idDocument', component: DetailDocumentComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'projects', component: ProjectCreationComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'KanbanBoard', component: KanbanBoardComponent },
      { path: 'labels', component: LabelsManagementComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'invitation', canActivate: [RolesGuard],
        data: { roles: ['1', '2'] }, component: InvitationComponent
      },



    ]
  },


  { path: 'logout', canActivate: [AuthGuard], component: LogoutComponent },
  { path: 'accept-invitation/:token', component: AcceptInvitationTMPComponent },
  {
    path: '', component: BackgroundComponent,
    loadChildren: () => import('./Pages/home/home.module').then(m => m.HomeModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
