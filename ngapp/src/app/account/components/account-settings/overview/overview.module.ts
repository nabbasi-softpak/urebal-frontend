import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from "./overview.component";
import {HouseholdOverviewComponent} from "./overview-tabs/household-overview/household-overview.component";
import {AccountOverviewComponent} from "./overview-tabs/account-overview/account-overview.component";
import {RestrictionOverviewComponent} from "./overview-tabs/restriction-overview/restriction-overview.component";
import {ChartLegendComponent} from "./chart-legend/chart-legend.component";
import {OverviewHouseholdTabComponent} from "./overview-household-tab/overview-household-tab.component";
import {OverviewAccountTabComponent} from "./overview-account-tab/overview-account-tab.component";
import {SharedModule} from "../../../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {OverviewDataService} from "./overview.dataservice";
import {OverviewService} from "./overview.service";

@NgModule({
    declarations: [
        OverviewComponent,
        HouseholdOverviewComponent,
        AccountOverviewComponent,
        RestrictionOverviewComponent,
        ChartLegendComponent,
        OverviewHouseholdTabComponent,
        OverviewAccountTabComponent
    ],
    providers: [
        OverviewDataService,
        OverviewService
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule
    ],
    exports: [
        OverviewComponent
    ]
})
export class OverviewModule {
}
