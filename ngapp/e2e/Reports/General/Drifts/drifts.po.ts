
import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class DriftsReportPage extends DashboardPage{
  navigateToDriftReports(){
    return browser.get('/reports/drifts');
  }

}
