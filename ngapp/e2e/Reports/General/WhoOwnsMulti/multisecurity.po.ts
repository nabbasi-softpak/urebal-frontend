import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class WhoOwnsMultiSecurityPage extends DashboardPage{
  navigateToWhoOWnsMultiSecurity(){
    return browser.get('/reports/who-owns-multisecurity');
  }

}
