import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from 'src/app/guards/login.guard';
import { ForgotPasswordTokenComponent } from './forgot-password-token/forgot-password-token.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [

  { path: 'login',  canActivate: [LoginGuard], component: LoginComponent },
{ path: 'forgotPassword',  canActivate: [LoginGuard], component: ForgotPasswordComponent },
{ path: 'forgotPassword/:token', component: ForgotPasswordTokenComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }