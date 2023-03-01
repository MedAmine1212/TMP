import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private http: HttpClient) { }
  getDocuments(idProject: number){
    return this.http.get(environment.url + "project/"+idProject+"/documents");
  }
  getDocument(idDocument: number){
    return this.http.get(environment.url + "documents/"+idDocument);
  }
  insertDoc(idProject: number,category: string, title: string, description: string){
    var headers = new Headers()
    .set('Access-Control-Allow-Origin', '*');
    let httpParams = new HttpParams()
    .set('project', idProject).set('category', category).set('title', title).set('description', description);
    return this.http.post(environment.url + "project/"+idProject+"/documents", { headers: headers },{
      params: httpParams, responseType: 'json', observe: 'response'
    });
  }
  deleteDoc(idDocument: number){
    return this.http.delete(environment.url+ "documents/"+idDocument);
  }
}
