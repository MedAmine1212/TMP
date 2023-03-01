import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router, CanDeactivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../Services/localStorage.service';

@Injectable({
    providedIn: 'root'
})
export class RolesGuard implements CanActivate {
    constructor(private router: Router,
        private localStorageService: LocalStorageService, private snackBar: MatSnackBar,
    ) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean> | Promise<boolean> | boolean {

        let roles = route.data['roles'] as Array<string>;
        let memberType = this.localStorageService.getFromLocalStorage().memberType;

        if (roles.some(x => x === memberType))
            return true;
        this.snackBar.open("Access denied", "Close", {
            duration: 5000
        });
        this.router.navigateByUrl('/tmp')
        return false;

    }
}













