import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private http: HttpClient) { }

  getHierarchy(idVersion: number){
    return this.http.get(environment.url + "version/"+idVersion+"/hierarchy");
  }

  putHierarchy(idVersion: number, newHierarchy: string){
    return this.http.put(environment.url + "version/"+idVersion+"/hierarchy",{"hierarchy": newHierarchy});
  }

  putHierarchy_Parents(idVersion: number, newHierarchy: string){
    return this.http.put(environment.url + "version/"+idVersion+"/hierarchy-parents", {
      "hierarchy": newHierarchy,
    });
  }

  getAllVersions(idProject : number){
    return this.http.get(environment.url+"version/getAllByProjectId/"+idProject);
  }
  addVersion(formData:FormData,idVersion : number){
    return this.http.post<any>(environment.url+"version/create/"+idVersion, formData);
  }
  editVersion(number : string,idVersion : number){
    return this.http.put(environment.url+"version/update/"+idVersion,{'number':number});
  }
  deleteVersion(idVersion: number){
    return this.http.delete(environment.url+"version/delete/"+idVersion);
  }
}
