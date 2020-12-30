import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../shared/shared.module';

import {DriftDetailsComponent} from './drift-details/drift-details.component';

import {DriftService} from "./drift.service";
import { DriftRoutingModule } from './drift-routing.module';
import {FormsModule} from "@angular/forms";
import {SharedDriftComponentsModule} from "../shared/shared-drift-components/shared-drift-components.module";
import {ModelService} from "../model/model.service";
import {jqxTooltipComponent} from "../../assets/jqwidgets-ts/angular_jqxtooltip";
import {AccountService} from "../account/account.service";
import {WorkspaceService} from "../workspaces/workspace.service";
import {ApplyEquivalenceModalComponent} from "./apply-equivalence-modal/apply-equivalence-modal.component";
import {TemplateService} from "../templates/template.service";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DriftRoutingModule,
    FormsModule,
    SharedDriftComponentsModule
  ],
  declarations: [],
  providers:[
    DriftService,
    AccountService,
    WorkspaceService,
    ModelService,
    TemplateService
  ],
  exports: [
    DriftDetailsComponent,
    jqxTooltipComponent,
    ApplyEquivalenceModalComponent
  ]
})
export class DriftModule { }
