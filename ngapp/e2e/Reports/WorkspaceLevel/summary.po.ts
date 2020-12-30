import {DashboardPage} from "../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class WorkspaceSummaryPage extends DashboardPage{
  navigateToRebalanceSummaryReport(){
    return browser.get('/reports/rebalance-summary-report');
  }

}
