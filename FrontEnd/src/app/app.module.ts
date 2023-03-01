import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';   // use this
import { FccontainerComponent } from './Pages/fccontainer/fccontainer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './Pages/layout/layout.component';
import { SidebarComponent } from './commun/noyau/sidebar/sidebar.component';
import { NavbarComponent } from './commun/noyau/navbar/navbar.component';
import { FooterComponent } from './commun/noyau/footer/footer.component';
import { ExigencesComponent } from './Pages/exigences/exigences.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { VersionsComponent } from './Pages/versions/versions.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DocumentsComponent } from './Pages/documents/documents.component';
import { AddDocumentComponent } from './Pages/add-document/add-document.component';
import { DetailDocumentComponent } from './Pages/detail-document/detail-document.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CalendarComponent } from './Pages/calendar/calendar.component';
import { CredentialsInterceptor } from './Interceptors/credentialsInterceptor';
import { LogoutComponent } from './Pages/logout/logout.component';
import { InvitationComponent } from './Pages/invitation/invitation.component';
import { FunctionnallistComponent } from './Pages/functionnallist/functionnallist.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { KanbanBoardComponent } from './Pages/kanban-board/kanban-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CollaboratorsComponent } from './Pages/collaborators/collaborators.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ScrumTeamComponent } from './Pages/scrum-team/scrum-team.component';
import { ProjectCreationComponent } from './Pages/project-creation/project-creation.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AcceptInvitationTMPComponent } from './Pages/accept-invitation-tmp/accept-invitation-tmp.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FunctionsComponent } from './Pages/functions/functions.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LabelsManagementComponent } from './Pages/labels-management/labels-management.component';
import { HomeModule } from './Pages/home/home.module';
import { ColorPickerModule } from 'ngx-color-picker';
import {MatTreeModule} from "@angular/material/tree";
import { ProfileComponent } from './Pages/profile/profile.component';
import { TeamInvitaionsComponent } from './Pages/team-invitaions/team-invitaions.component';
import {MatDialogModule} from "@angular/material/dialog";
import {InvitationsConfirmationDialogComponent} from "./Pages/invitations-confirmation-dialog/invitations-confirmation-dialog.component";
import { AddFunctionReqModalComponent } from './Pages/add-function-req-modal/add-function-req-modal.component';
import {WorkloadComponent} from "./Pages/workload/workload.component";
import {WorkloadDetailsComponent} from "./Pages/workload-details/workload-details.component";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    ExigencesComponent,
    VersionsComponent,
    DocumentsComponent,
    AddDocumentComponent,
    DetailDocumentComponent,
    CollaboratorsComponent,
    LogoutComponent,
    CalendarComponent,
    InvitationComponent,
    FccontainerComponent,
    ProjectCreationComponent,
    FunctionnallistComponent,
    KanbanBoardComponent,
    ScrumTeamComponent,
    AcceptInvitationTMPComponent,
    FunctionsComponent,
    LabelsManagementComponent,
    ProfileComponent,
    TeamInvitaionsComponent,
    InvitationsConfirmationDialogComponent,
    AddFunctionReqModalComponent,
    WorkloadComponent,
    WorkloadDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    CKEditorModule,
    DragDropModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    Ng2SearchPipeModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    ColorPickerModule,
    MatStepperModule,
    HomeModule,
    MatTreeModule,
    MatDialogModule
  ],
  providers: [[
    { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true }
  ],],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
