import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { collaborator } from '../models/Collaborator';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(formData: any) {
    return this.http.post<any>(environment.url + "login", formData, { withCredentials: true });
  }

  getCurrentUser() {
    return this.http.get(environment.url + "user");
  }


}
