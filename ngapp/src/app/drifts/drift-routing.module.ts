import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DriftsListComponent} from './drifts-list/drifts.list.component';
import {DriftDetailsComponent} from './drift-details/drift-details.component';
import {AuthGuardService} from "../services/auth-guard.service";

const routes: Routes = [
  { path: 'list', component: DriftsListComponent,
    data :
      {
        permissionName: 'portfolioList',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'driftDetails/:portfolioId/:portfolioName/:driftStatus/:isHousehold', component: DriftDetailsComponent,
    data :
      {
        permissionName: 'portfolioViewDrift',
        checkSessionValidation: false
      }
  },
  { path: 'driftDetails', component: DriftDetailsComponent,
    data :
      {
        permissionName: 'portfolioViewDrift',
        checkSessionValidation: false
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriftRoutingModule {}
