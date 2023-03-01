import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { ForgotPasswordService } from 'src/app/Services/forgotPassword.service';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../background/background.component.css',
    '../../../../assets/css/bootstrap.min.css',
    '../../../../assets/css/font-awesome.min.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private forgotPasswordService: ForgotPasswordService, private router: Router
  ) { }

  ngOnInit(): void {
  }

  forgotPasswordForm = this.formBuilder.group({

    email: ['', [
      Validators.required,
      Validators.email

    ]],



  });
  get f() { return this.forgotPasswordForm.controls; }


  submit() {
    const formData = new FormData();

    formData.append('email', this.forgotPasswordForm.value.email);

    this.forgotPasswordService.forgotPasswordRequest(formData).subscribe({
      next: (v) => {
        this.snackBar.open("Check your email for a link to reset your password.", "Close", {
          duration: 5000
        });
      },
      error: (e) => {
        if (e.status == 404)
          this.snackBar.open("That address  is not associated with a personal user account", "Close", {
            duration: 5000
          });
        console.error("error :" + e);

      },
      complete: () => this.router.navigate(['/login'])

    });

  }

}
