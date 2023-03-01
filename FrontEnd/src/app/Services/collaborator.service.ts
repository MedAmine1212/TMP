import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { collaborator } from '../models/Collaborator';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  constructor(private http: HttpClient) { }

    createAccountCollaborator(formData: any) {
        return this.http.post<any>(environment.url + "createAccountCollaborator", formData);
    }

    verifyInvitationToken(formData: any) {
        return this.http.post<any>(environment.url + "verifyInvitationToken", formData);
    }
    sendEmailInvitation(formData: any) {
        return this.http.post<any>(environment.url + "sendEmailInvitation", formData);
    }

    changePasswordCollaborator(formData: any) {
        return this.http.post<any>(environment.url + "changePasswordCollaborator", formData);
    }

    getCollaborators() {
        return this.http.get<collaborator>(environment.url + "getCollaborators");

    }
    deleteCollaborator(idCollaborator: number) {
        return this.http.delete<any>(environment.url + "deleteCollaborator/" + idCollaborator);
    }
  getNonActiveCollabs(){
    return this.http.get(environment.url + "nonActiveCollab");
  }

  cancelInvite(id:number) {
    return this.http.delete(environment.url + "cancelInvite/"+id);

  }

  getCurrentScrumTeam(id:number) : Observable<any>{
    return this.http.get<Array<any>>(environment.url + "getCurrentScrumTeam/"+id);
  }

  getInvitattionsByCollabId(id:number) : Observable<any>{
    return this.http.get<Array<any>>(environment.url + "getInvitesByCollabId/"+id);
  }
  accpetInvitaion(id:number){
    return this.http.get(environment.url + "acceptInvitation/"+id);
  }


  getAllCollabs() {
    return this.http.get(environment.url + "getCollaborators");
  }
}
