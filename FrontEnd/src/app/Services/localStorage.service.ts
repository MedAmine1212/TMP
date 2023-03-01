import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor(private cookieService: CookieService,
    ) { }

    clearStorage() {
        localStorage.clear();
    }
    setToLocalStorage(collaborator: any) {
        localStorage.setItem('memberId', collaborator.id);
        localStorage.setItem('memberType', collaborator.memberType);
        localStorage.setItem('fullName', collaborator.lastName + " " + collaborator.firstName);
    }

    getFromLocalStorage() {
        const storage = {
            memberId: localStorage.getItem('memberId'),
            memberType: localStorage.getItem('memberType'),
            fullName: localStorage.getItem('fullName')
        }
        return storage;
    }





    localStorage(): boolean {
        const storage = this.getFromLocalStorage();

        if (!storage.fullName || !storage.memberType || !storage.memberId)
            return false
        return true;
    }
    removeUser() {

        localStorage.removeItem('memberId');
        localStorage.removeItem('memberType');
        localStorage.removeItem('fullName');

        this.cookieService.delete('token');
    }
}
