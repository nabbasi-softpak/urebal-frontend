import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SecurityService} from './security.service';

import {SharedModule} from '../shared/shared.module';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityMasterComponent } from './security-master/security-master.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SecurityRoutingModule
  ],
  declarations: [
    SecurityMasterComponent
  ],
  providers: [
    SecurityService
  ],
  exports:[]
})
export class SecurityModule { }
