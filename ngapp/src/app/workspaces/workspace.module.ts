import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from "ng2-dragula";
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from '../account/account.module';
import { WorkspaceRoutingModule } from './workspace-routing.module';

import { WorkspaceComponent } from './workspace-list/workspace.component';
import { CreateWorkspaceComponent } from './create-workspace/create-workspace.component';
import { ExecuteWorkspaceComponent } from './execute-workspace/execute-workspace.component';
import { WorkspaceReportsComponent } from './workspace-reports/workspace-reports.component';
import { CriteriaBuilderComponent } from './components/criteria-builder/criteria-builder.component';
import { AccountNameCriteriaComponent } from './components/criteria-builder/acc-name-criteria/acc-name-criteria.component';
import { MarketValueCriteriaComponent } from './components/criteria-builder/mkt-val-criteria/mkt-val-criteria.component';
import { HouseholdCriteriaComponent } from './components/criteria-builder/household-criteria/household-criteria.component';
import { ModelCriteriaComponent } from './components/criteria-builder/model-criteria/model-criteria.component';
import { TaxableCriteriaComponent } from './components/criteria-builder/taxable-criteria/taxable-criteria.component';
import { DriftCriteriaComponent } from './components/criteria-builder/drift-criteria/drift-criteria.component';
import { EditWorkspaceComponent } from './edit-workspace/edit-workspace.component'

import { WorkspaceService } from './workspace.service';
import { CriteriaService } from './components/criteria-builder/criteria.service';
import { TradeOverrideComponent } from './tradeoverride/tradeoverride.component';
import { WorkspaceSwapDetailsComponent } from './workspace-swap-details/workspace-swap-details.component';
import { DriftStatusCriteriaComponent } from './components/criteria-builder/drift-status-criteria/drift-status-criteria.component';
import { EquivalenceService } from '../equivalences/equivalence.service';
import { ModelService } from '../model/model.service';
import { DriftService } from '../drifts/drift.service';
import { DriftStatus, AccountService } from '../account/account.service';
import { PortfolioService } from '../account/portfolio.service';
import {SharedWorkspaceAccountModule} from "../shared/shared-workspace-account/shared-workspace-account.module";
import {TemplateService} from "../templates/template.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // DragulaModule,
    SharedModule,
    WorkspaceRoutingModule,
    SharedWorkspaceAccountModule
  ],
  declarations: [
    CriteriaBuilderComponent,
    AccountNameCriteriaComponent,
    MarketValueCriteriaComponent,
    HouseholdCriteriaComponent,
    ModelCriteriaComponent,
    TaxableCriteriaComponent,
    DriftCriteriaComponent,
    WorkspaceComponent,
    CreateWorkspaceComponent,
    ExecuteWorkspaceComponent,
    WorkspaceReportsComponent,
    TradeOverrideComponent,
    EditWorkspaceComponent,
    WorkspaceSwapDetailsComponent,
    DriftStatusCriteriaComponent,
  ],
  providers: [
    CriteriaService,
    WorkspaceService,
    DatePipe,

    AccountService,
    PortfolioService,
    DriftStatus,
    DriftService,
    ModelService,
    EquivalenceService,
    TemplateService
  ],
  exports:[],
  entryComponents: [
    CriteriaBuilderComponent,
    AccountNameCriteriaComponent,
    MarketValueCriteriaComponent,
    HouseholdCriteriaComponent,
    ModelCriteriaComponent,
    TaxableCriteriaComponent,
    DriftCriteriaComponent,
    DriftStatusCriteriaComponent
  ]
})
export class WorkspaceModule { }
