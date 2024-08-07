import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMatModule } from './angular-material/angular-material.module';
import { NgxsModule } from '@ngxs/store';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ngxsConfig } from 'src/ngxs.config';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SharedModule } from './shared/shared.module';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { AuthState } from './authentication/state/auth.state';
import { HttpClientModule } from '@angular/common/http';

const states = [
  AuthState
]
@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    AdminDashboardComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMatModule,
    SharedModule,
    HttpClientModule,
    NgxsModule.forRoot(states, ngxsConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
