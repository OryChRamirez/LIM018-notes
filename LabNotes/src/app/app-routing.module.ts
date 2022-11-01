import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSingUpComponent } from './components/view-sing-up/view-sing-up.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';
import { ViewMainComponent } from './components/view-main/view-main.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'sing-in', component: ViewSingUpComponent,
      ...canActivate(() => redirectLoggedInTo(['/main']))
    },
    { path: 'login', component: ViewLoginComponent,
    ...canActivate(() => redirectLoggedInTo(['/main']))},
    { 
      path: 'main',
     component: ViewMainComponent,
      ...canActivate(()=> redirectUnauthorizedTo(['/login']))
    },
    { path: 'forgert-password', component: ForgetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
