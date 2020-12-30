import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityMasterComponent} from './security-master/security-master.component';
import {AuthGuardService} from "../services/auth-guard.service";

const routes: Routes = [
  { path: 'master', component: SecurityMasterComponent,
    data :
        {
          permissionName: 'securitymasterView',
          checkSessionValidation: false
        }, canActivate : [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SecurityRoutingModule { }
