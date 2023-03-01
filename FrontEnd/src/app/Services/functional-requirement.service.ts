import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { functionalrequirement } from '../models/functionalrequirement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FunctionalRequirementService {

  constructor(private http: HttpClient) { }

  getCalendarFunctionalRequirement(idVersion: number): Observable<any> {
    return this.http.get<Array<any>>(environment.url + "version/" + idVersion + "/calendar_functional_requirements");
  }

  getFunctionalRequirements(idVersion: number): Observable<any> {
    return this.http.get<Array<functionalrequirement>>(environment.url + "version/" + idVersion + "/functionalrequirements");
  }

  postFunctionalRequirementMin(idVersion: number, author: number, title: string) {
    return this.http.post<functionalrequirement | string>(environment.url + "version/" + idVersion + "/functionalrequirementmin", { "author": author, "title": title });
  }

  postMultipleFunctionalRequirements(idVersion: number, functionalRequirements: Array<any>) {
    return this.http.post(environment.url + "version/" + idVersion + "/multiple-functional-requirements", { "functional_requirements": functionalRequirements });
  }

  deleteMultipleFunctionalRequirements(ids: Array<number>) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', }),
      body: { functional_requirements: ids }
    };
    return this.http.delete(environment.url + "multiple-functional-requirements", options);
  }

  updateTitles(frsToUpdate: Array<any>) {
    return this.http.put(environment.url + "functional-requirements-titles", { "frsToUpdate": frsToUpdate });
  }

  updateHierarchy(fr: Array<any>) {
    return this.http.put(environment.url + "updateHierarchy", { "frsToUpdate": fr });
  }

  updateFunctionRequirement(body:any, id:number){
    return this.http.put(environment.url+"functionalrequirement/update/"+id,body)
  }

  updateStatusKanban(body:any, id:number) {
    return this.http.put(environment.url+"functionalrequirementStatusKanban/update/"+id,body);
  }
  
  addFr(version: number, func: functionalrequirement) {
    return this.http.post(environment.url+"version/"+version+"/functionalrequirements",{'title':func.title,'description':func.description,'parentId':func.parentId,'author':func.author.id, 'estimationTime':func.estimationTime})
  }

  deleteFr(id: number) {
    return this.http.delete(environment.url + "functionalrequirement/"+id);
  }
}
