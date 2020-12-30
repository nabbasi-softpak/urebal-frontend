import {browser} from "protractor";
import {DashboardPage} from "../../../Dashboard/dashboard.po";

export class AccountsReportPage extends DashboardPage{
  navigateToAccountsReport(){
    return browser.get('/reports/accounts-report');
  }

}
