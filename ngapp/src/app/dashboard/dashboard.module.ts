import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {FormsModule} from '@angular/forms';

import { DashboardComponent } from './dashboard.component'
import { DashboardService } from './dashboard.service';
import { AccountsAggregateComponent } from './components/accounts-aggregate/accounts-aggregate.component';
import { HouseholdsAggregateComponent } from './components/households-aggregate/households-aggregate.component';
import { TaxableAccountsAggregateComponent } from './components/taxable-accounts-aggregate/taxable-accounts-aggregate.component';
import { DriftedAccountsAggregateComponent } from './components/drifted-accounts-aggregate/drifted-accounts-aggregate.component';
import { AccountWidgetComponent } from './components/account-widget/account-widget.component';
import { ModelWidgetComponent } from './components/model-widget/model-widget.component';
import { SecurityWidgetComponent } from './components/security-widget/security-widget.component';
import { BlockUIModule } from 'ng-block-ui';
import {DashBoardRoutingModule} from "./dashboard-routing.module";
import { DriftreportSummaryWidgetComponent } from './components/driftreport-summary-widget/driftreport-summary-widget.component';
import { LastTradesExecutedComponent } from './components/last-trades-executed-widget/last-trades-executed.component';
import { DriftStatus } from '../account/account.service';
import {DriftService} from "../drifts/drift.service";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    BlockUIModule,
    DashBoardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    AccountsAggregateComponent,
    HouseholdsAggregateComponent,
    TaxableAccountsAggregateComponent,
    DriftedAccountsAggregateComponent,
    AccountWidgetComponent,
    ModelWidgetComponent,
    SecurityWidgetComponent,
    DriftreportSummaryWidgetComponent,
    LastTradesExecutedComponent
  ],
  providers: [
    DashboardService,
    DriftStatus,
    DriftService
  ]
})
export class DashboardModule { }
