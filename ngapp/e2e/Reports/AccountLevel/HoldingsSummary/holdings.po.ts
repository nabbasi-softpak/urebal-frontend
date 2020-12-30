import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class HoldingsSummaryPage extends DashboardPage{
  navigateToHoldingsReport(){
    return browser.get('/reports/holdings-report');
  }

}
