import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class HouseholdsReportPage extends DashboardPage{
  navigateToHouseholdReports(){
    return browser.get('/reports/households-report');
  }

}
