import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {SharedModule} from '../shared/shared.module';
import {UserRoutingModule} from './user-routing.module';

import {LoginComponent} from './login/login.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

import {ReCaptchaModule} from 'angular2-recaptcha';
import {UserService} from './user.service';
import {LocalStorageModule, LocalStorageService} from 'angular-2-local-storage';
import { TermsComponent } from './terms/terms.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    UserRoutingModule,
    ReCaptchaModule,
    LocalStorageModule.forRoot({
      prefix: 'urebal-app',
      storageType: "localStorage"
    })
  ],
  declarations: [
    LoginComponent,
    ChangePasswordComponent,
    TermsComponent,
    NotFoundPageComponent
  ],
  providers:[
    UserService,

  ]
})
export class UserModule { }
