import {browser} from "protractor";
import {DashboardPage} from "../../../Dashboard/dashboard.po";

export class SecurityModelSummaryPage extends DashboardPage{
  navigateToSecurityModelReport(){
    return browser.get('/reports/security-model-report');
  }

}
