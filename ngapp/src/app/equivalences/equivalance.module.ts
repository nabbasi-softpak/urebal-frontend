import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../shared/shared.module';
import {EquivalanceRoutingModule} from './equivalance-routing.module';

import {EquivalenceService} from './equivalence.service';
import {DragulaModule} from "ng2-dragula";
import {ModelService} from "../model/model.service";
import {AccountService} from "../account/account.service";
import {SharedWorkspaceAccountModule} from "../shared/shared-workspace-account/shared-workspace-account.module";
import { EquivalenceDetailComponent } from './equivalences-list/equivalence-detail/equivalence-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EquivalanceRoutingModule,
    DragulaModule,
    SharedWorkspaceAccountModule
  ],
  providers: [
    EquivalenceService,
    ModelService,
    AccountService
  ]
})
export class EquivalanceModule { }
