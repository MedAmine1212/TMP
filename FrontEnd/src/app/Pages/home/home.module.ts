import { NgModule } from '@angular/core';

import { BackgroundComponent } from './background/background.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeRoutingModule } from './home-routing.module';
import { ForgotPasswordTokenComponent } from './forgot-password-token/forgot-password-token.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    BackgroundComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordTokenComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    MatIconModule,



  ]
})
export class HomeModule { }
