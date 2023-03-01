import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CollaboratorService } from 'src/app/Services/collaborator.service';
import { Router } from '@angular/router';
import { CookieService } from
  'ngx-cookie-service';
import { mustMatch } from 'src/app/validators/mustMatchValidator';
import { MatSnackBar } from "@angular/material/snack-bar";
import { LocalStorageService } from 'src/app/Services/localStorage.service';






@Component({
  selector: 'app-accept-invitation-tmp',
  templateUrl: './accept-invitation-tmp.component.html',
  styleUrls: ['./accept-invitation-tmp.component.css',
    '../../../assets/css/bootstrap.min.css',
    '../../../assets/font-awesome/css/font-awesome.css',
    '../../../assets/css/animate.css',
    '../../../assets/css/style.css']
})
export class AcceptInvitationTMPComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private ar: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private router: Router,
    private cookieService: CookieService,
    private _snackBar: MatSnackBar,
    private localStorageService: LocalStorageService
  ) { }

  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: ['', this.validateName] });
  secondFormGroup: FormGroup = this._formBuilder.group({ secondCtrl: [''] });
  thirdFormGroup: FormGroup = this._formBuilder.group({ thirdCtrlPassword: [''], thirdCtrlConfirmPassword: [''] }, { validator: mustMatch('thirdCtrlPassword', "thirdCtrlConfirmPassword") },
  );
  get password() {
    return this.thirdFormGroup.get('thirdCtrlPassword');
  }
  get confirmPassword() {
    return this.thirdFormGroup.get('thirdCtrlConfirmPassword');
  }
  get name() {
    return this.firstFormGroup.get('firstCtrl');
  }
  tokenExpired: boolean = false;
  tokenValid: boolean = true;
  token: string = "";

  ngOnInit(): void {
    this.localStorageService.removeUser();
    this.token = this.ar.snapshot.paramMap.get('token');


    const formData = new FormData();

    formData.append('invitationToken', this.token);

    this.collaboratorService.verifyInvitationToken(formData).subscribe({
      next: (v) => {

      },
      error: (e) => {
        if (e.status == 404)
          this.tokenValid = false;
        else if (e.status == 400)
          this.tokenExpired = true;



      },
      complete: () => { }

    });

  }



  validateName(control: FormControl) {
    let count = control.value.split(' ').length - 1;
    console.log(count);
    if (control.value != null && count != 1)
      return { validateName: true }
    return null;

  }

  submit() {
    console.log(this.firstFormGroup.value.firstCtrl);

    const formData = new FormData();

    formData.append('name', this.firstFormGroup.value.firstCtrl);
    formData.append('phone', this.secondFormGroup.value.secondCtrl);
    formData.append('password', this.thirdFormGroup.value.thirdCtrlPassword);
    formData.append('invitationToken', this.token);




    this.collaboratorService.createAccountCollaborator(formData).subscribe({
      next: (v) => {


      },
      error: (e) => {

        this._snackBar.open("Error, please try again", "Close", {
          duration: 5000
        });
      },
      complete: () => {
        this._snackBar.open("Account created successfully", "Close", {
          duration: 5000
        });
        this.router.navigate(['/login']);
      }

    });




  }

}
