import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, DriftStatus} from './account.service';
import { PortfolioService } from './portfolio.service';
import { SharedModule} from '../shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { DriftService } from '../drifts/drift.service';
import { ModelService } from '../model/model.service';
import { EquivalenceService } from '../equivalences/equivalence.service';
import { SharedWorkspaceAccountModule} from "../shared/shared-workspace-account/shared-workspace-account.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AccountRoutingModule,
    SharedWorkspaceAccountModule
  ],
  declarations: [],
  providers: [
    AccountService,
    PortfolioService,
    DriftStatus,
    DriftService,
    ModelService,
    EquivalenceService
  ],
  exports:[
  ]
})
export class AccountModule { }
