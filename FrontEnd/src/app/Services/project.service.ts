import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { project } from '../models/project';



@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getProjects() :Observable<any> {
    return this.http.get(environment.url+'projects');
  }

  getProjectsByProductOwner(idProductOwner : number){
    return this.http.get<project[]>(environment.url+'project/'+idProductOwner);
  }
}
