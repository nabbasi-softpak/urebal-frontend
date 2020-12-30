import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {DriftModule} from '../drifts/drift.module';
import {ReportsRoutingModule} from './reports-routing.module';
import {WhoOwnsComponent} from './who-owns/who-owns.component';
import {ReportsService} from './reports.service';
import {SharelotReportComponent} from './account/sharelot-report/sharelot-report.component';
import {StockReportComponent} from './account/stock-report/stock-report.component';
import {AttributeReportComponent} from './account/attribute-report/attribute-report.component';
import {HoldingReportComponent} from './account/holding-report/holding-report.component';
import {TaxCostCurveReportComponent} from './account/tax-cost-curve-report/tax-cost-curve-report.component';
import {TradeCostCurveReportComponent} from './account/trade-cost-curve-report/trade-cost-curve-report.component'
import {SecurityModelReportComponent} from "./model/security-model-report/security-model-report.component";
import {AttributeModelReportComponent} from './model/attribute-model-report/attribute-model-report.component';
import {WorkspaceSummaryReportComponent} from "./workspace/workspace-summary-report/workspace-summary-report.component";
import {DriftReportComponent} from './account/drift-report/drift-report.component';
import {WhoOwnsMultisecurityComponent} from './General/who-owns-multisecurity/who-owns-multisecurity.component';
import {WhoOwnsSecurityComponent} from './General/who-owns-multisecurity/who-owns-security/who-owns-security.component';
import {WashsaleReportComponent} from './account/washsale-report/washsale-report.component';
import {AutocompleteComponent} from "../shared/components/autocomplete/autocomplete.component";
import {DriftsReportComponent} from './drifts-report/drifts-report.component';
import {HouseholdsReportComponent} from './households-report/households-report.component';
import {AccountsReportComponent} from './accounts-report/accounts-report.component';
import {BlockUIModule} from 'ng-block-ui';
import {WorkspaceService} from '../workspaces/workspace.service';
import {AccountService} from '../account/account.service';
import {DriftService} from '../drifts/drift.service';
import {ModelService} from '../model/model.service';
import {SharedDriftComponentsModule} from "../shared/shared-drift-components/shared-drift-components.module";
import {AutocompleteSecurityModule} from "../shared/components/autocomplete/autocomplete-security/autocomplete-security.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReportsRoutingModule,
        BlockUIModule,
        SharedDriftComponentsModule,
        AutocompleteSecurityModule
    ],
    declarations: [
        WhoOwnsComponent,
        SharelotReportComponent,
        StockReportComponent,
        AttributeReportComponent,
        HoldingReportComponent,
        TaxCostCurveReportComponent,
        TradeCostCurveReportComponent,
        HoldingReportComponent,
        SecurityModelReportComponent,
        AttributeModelReportComponent,
        WorkspaceSummaryReportComponent,
        DriftReportComponent,
        WhoOwnsMultisecurityComponent,
        WhoOwnsSecurityComponent,
        WashsaleReportComponent,
        DriftsReportComponent,
        HouseholdsReportComponent,
        AccountsReportComponent,
    ],
    providers: [
        ReportsService,
        WorkspaceService,
        AccountService,
        DriftService,
        ModelService
    ],
    entryComponents: [
        WhoOwnsSecurityComponent,
    ]
})
export class ReportsModule {
}
