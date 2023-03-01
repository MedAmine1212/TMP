import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {

    constructor(private http: HttpClient) { }

    forgotPasswordRequest(formData: any) {
        return this.http.post<any>(environment.url + "forgotPasswordRequest", formData, { withCredentials: true });
    }

    forgetPasswordVerifyToken(formData: any) {
        return this.http.post<any>(environment.url + "forgetPasswordVerifyToken", formData, { withCredentials: true });
    }


}
