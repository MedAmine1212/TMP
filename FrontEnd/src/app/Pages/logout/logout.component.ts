import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'src/app/Services/localStorage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private cookieService: CookieService, private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.localStorageService.removeUser();

    this.router.navigate(['/login']);
  }

}
