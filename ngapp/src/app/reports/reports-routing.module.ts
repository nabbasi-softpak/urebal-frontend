import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WhoOwnsComponent} from './who-owns/who-owns.component';
import {SharelotReportComponent} from './account/sharelot-report/sharelot-report.component';
import {StockReportComponent} from './account/stock-report/stock-report.component';
import {AttributeReportComponent} from './account/attribute-report/attribute-report.component';
import {HoldingReportComponent} from './account/holding-report/holding-report.component';
import {DriftReportComponent} from './account/drift-report/drift-report.component';
import {TaxCostCurveReportComponent} from './account/tax-cost-curve-report/tax-cost-curve-report.component';
import {TradeCostCurveReportComponent} from './account/trade-cost-curve-report/trade-cost-curve-report.component';
import {WorkspaceSummaryReportComponent} from './workspace/workspace-summary-report/workspace-summary-report.component';
import {SecurityModelReportComponent} from "./model/security-model-report/security-model-report.component";
import {AttributeModelReportComponent} from "./model/attribute-model-report/attribute-model-report.component";
import {WhoOwnsMultisecurityComponent} from "./General/who-owns-multisecurity/who-owns-multisecurity.component";
import {WashsaleReportComponent} from './account/washsale-report/washsale-report.component';
import {DriftsReportComponent} from './drifts-report/drifts-report.component';
import {HouseholdsReportComponent} from './households-report/households-report.component';
import {AccountsReportComponent} from './accounts-report/accounts-report.component';


const routes: Routes = [
  { path: 'who-owns', component: WhoOwnsComponent,
    data :
      {
        permissionName: 'reportWhoOwns'
      }
  },
  { path: 'who-owns-multisecurity', component: WhoOwnsMultisecurityComponent,
    data :
      {
        permissionName: 'reportWhoOwns'
      }
  },
  { path: 'sharelot-report', component: SharelotReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'stock-report', component: StockReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'attribute-report', component: AttributeReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'holdings-report', component: HoldingReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'drift-report', component: DriftReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'rebalance-summary-report', component: WorkspaceSummaryReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'security-model-report', component: SecurityModelReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'attribute-model-report', component: AttributeModelReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'taxCostCurveReport', component: TaxCostCurveReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'tradeCostCurveReport', component: TradeCostCurveReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'washsale-report', component: WashsaleReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'drifts', component: DriftsReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'households-report', component: HouseholdsReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  },
  { path: 'accounts-report', component: AccountsReportComponent,
    data :
      {
        permission: 'reportWhoOwns'
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
