import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/Services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from
  'ngx-cookie-service';
import { LocalStorageService } from 'src/app/Services/localStorage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../background/background.component.css',
    '../../../../assets/css/bootstrap.min.css',
    '../../../../assets/css/font-awesome.min.css']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService,
    private localStorageService: LocalStorageService) { }

  ngOnInit(): void {



  }
  divLoginShow = false;



  loginForm: FormGroup = this.formBuilder.group({ email: [''], password: [''] },
  );



  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }


  login() {

    const formData = new FormData();

    formData.append('email', this.loginForm.value.email);
    formData.append('password', this.loginForm.value.password);


    this.loginService.login(formData).subscribe({
      next: (v) => {


        this.localStorageService.setToLocalStorage(v.message)







      },
      error: (e) => {
        console.error("error :" + e);
        this.divLoginShow = true;

      },
      complete: () => this.router.navigate(['/tmp'])

    });
  }
  showPassword = false;




  toggleShow() {
    this.showPassword = !this.showPassword;
  }

}
