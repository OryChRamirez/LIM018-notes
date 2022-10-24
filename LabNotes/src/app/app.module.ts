import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewSingUpComponent } from './components/view-sing-up/view-sing-up.component';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { ViewLoginComponent } from './components/view-login/view-login.component';


@NgModule({
  declarations: [
    AppComponent,
    ViewSingUpComponent,
    ViewLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


