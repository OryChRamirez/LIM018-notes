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
import { HeaderComponent } from './components/header/header.component';
import { ViewMainComponent } from './components/view-main/view-main.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { StickyNotesComponent } from './components/sticky-notes/sticky-notes.component';
import { FormsModule } from '@angular/forms';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';


@NgModule({
  declarations: [
    AppComponent,
    ViewSingUpComponent,
    ViewLoginComponent,
    HeaderComponent,
    ViewMainComponent,
    DropdownMenuComponent,
    ForgetPasswordComponent,
    StickyNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }


