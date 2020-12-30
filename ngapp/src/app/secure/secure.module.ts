
import { CommonModule } from '@angular/common';
import { SecureRoutingModule } from './secure-routing.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { HistoryComponent } from '../history/history.component';
import { SecureComponent } from '../secure/secure.component';
import {NotificationComponent} from "../shared/components/notification/notification.component";
import {NotificationService} from "../shared/components/notification/notification.service";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    UserModule,
    BlockUIModule,
    SecureRoutingModule
  ],
  declarations: [
    SecureComponent,
    HistoryComponent,
    NotificationComponent
  ],
  providers: [
    NotificationService
  ]
})
export class SecureModule { }
