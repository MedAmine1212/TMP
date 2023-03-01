import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import { ScrumTeam } from '../models/ScrumTeam';

@Injectable({
  providedIn: 'root'
})
export class ScrumTeamService {

  constructor(private http: HttpClient) {
  }

  getAllScrumTeams(): Observable<any> {
    return this.http.get<Array<any>>(environment.url + "getAllScrumTeams");
  }

  assignCollabToTeam(idCollab:number,idTeam:number,role:string): Observable<any> {
    return this.http.post(environment.url + "assignCollaboratorToScrumTeam", {"idCollaborator":idCollab,'idScrumTeam':idTeam,'role':role});
  }

  removeCollabFromTeam(idTeam:number,idCollab:number): Observable<any> {
    return this.http.delete(environment.url + "scrumteam/"+idTeam+"/remove/"+idCollab);
  }

  getAllScrumTeamsByProductOwner(idProductOwner : number) {
    return this.http.get<ScrumTeam[]>(environment.url + "getScrumTeamsByProductOwner/"+idProductOwner);
  }

  getScrumTeamById(idScrumTeam : number) {
    return this.http.get<any>(environment.url + "getScrumTeamById/"+idScrumTeam);
  }

  addScrumTeam(scrumteam : any) {
    return this.http.post(environment.url + "scrumTeam", scrumteam);
  }

  affectProjectToTeam(obj : any){
    return this.http.post(environment.url + "assignProjectToScrumTeam", obj);
  }
}
