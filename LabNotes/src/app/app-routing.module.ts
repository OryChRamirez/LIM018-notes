import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSingUpComponent } from './components/view-sing-up/view-sing-up.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';
import { ViewMainComponent } from './components/view-main/view-main.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/main' },
    { path: 'sing-in', component: ViewSingUpComponent },
    { path: 'login', component: ViewLoginComponent},
    { 
      path: 'main',
     component: ViewMainComponent,
      ...canActivate(()=> redirectUnauthorizedTo(['/sing-in']))
    },
    { path: 'forgert-password', component: ForgetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
