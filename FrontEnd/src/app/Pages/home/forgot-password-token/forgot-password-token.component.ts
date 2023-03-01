import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mustMatch } from 'src/app/validators/mustMatchValidaor';
import { MatSnackBar } from "@angular/material/snack-bar";
import { CookieService } from 'ngx-cookie-service';
import { ForgotPasswordService } from 'src/app/Services/forgotPassword.service';
import { CollaboratorService } from 'src/app/Services/collaborator.service';
import { LocalStorageService } from 'src/app/Services/localStorage.service';



@Component({
  selector: 'app-forgot-password-token',
  templateUrl: './forgot-password-token.component.html',
  styleUrls: ['../background/background.component.css',
    '../../../../assets/css/bootstrap.min.css',
    '../../../../assets/css/font-awesome.min.css']
})
export class ForgotPasswordTokenComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router,
    private collaboratorService: CollaboratorService,
    private localStorageService: LocalStorageService) { }
  token: string = "";
  tokenExpired: boolean = false;
  tokenValid: boolean = true;

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');


    this.localStorageService.removeUser();


    const formData = new FormData();

    formData.append('token', this.token);

    this.forgotPasswordService.forgetPasswordVerifyToken(formData).subscribe({
      next: (v) => {

      },
      error: (e) => {
        if (e.status == 404) {
          this.tokenValid = false;
          this.snackBar.open("Link is not valid", "Close", {
            duration: 5000
          });
          this.router.navigate(['/login'])



        }
        else if (e.status == 400) {
          this.snackBar.open("Link is expired", "Close", {
            duration: 5000
          });
          this.tokenExpired = true;
          this.router.navigate(['/login'])


        }



      },
      complete: () => { }

    });

  }






  forgotPasswordForm: FormGroup = this.formBuilder.group({ password: [''], confirmPassword: [''] }, { validator: mustMatch('password', "confirmPassword") },
  );
  get password() {
    return this.forgotPasswordForm.get('password');
  }
  get confirmPassword() {
    return this.forgotPasswordForm.get('confirmPassword');
  }

  submit() {

    const formData = new FormData();

    formData.append('token', this.token);
    formData.append('password', this.forgotPasswordForm.value.password);
    console.log(this.forgotPasswordForm.value.password);


    this.collaboratorService.changePasswordCollaborator(formData).subscribe({
      next: (v) => {
        this.snackBar.open("Password changed successfully.", "Close", {
          duration: 5000
        });
      },
      error: (e) => {
        this.snackBar.open("Server error", "Close", {
          duration: 5000
        });

      },
      complete: () =>

        this.router.navigate(['/login'])



    });




  }
  showPasswordFirst = false;
  showPasswordSecond = false;




  toggleShowPassword() {
    this.showPasswordFirst = !this.showPasswordFirst;
  }
  toggleShowConfirmPassword() {
    this.showPasswordSecond = !this.showPasswordSecond;
  }

}