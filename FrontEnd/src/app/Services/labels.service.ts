import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { labels } from '../models/labels';


@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  constructor(private http: HttpClient) { }

  getAllLabels() {
    return this.http.get<labels[]>(environment.url + "labels");
  }

  addLabel(label : labels) {
    return this.http.post(environment.url + "labels", label);
  }

  updateLabel(label : labels){
    return this.http.put(environment.url + "labels/" + label.id, label);
  }

  deleteLabel(idLabel : number){
    return this.http.delete(environment.url + "labels/" + idLabel);
  }
}
