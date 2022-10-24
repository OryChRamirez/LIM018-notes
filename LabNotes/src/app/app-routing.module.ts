import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSingUpComponent } from './components/view-sing-up/view-sing-up.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/sing-in' },
    { path: 'sing-in', component: ViewSingUpComponent },
    { path: 'login', component: ViewLoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
