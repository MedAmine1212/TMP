import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from
    'ngx-cookie-service';
import { LocalStorageService } from '../Services/localStorage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private localStorageService: LocalStorageService) {

    }

    canActivate(): boolean {

        if (!this.localStorageService.localStorage()) {
            this.router.navigate(['/login']);
            this.localStorageService.removeUser();

            return false;
        }

        return true;

    }

}