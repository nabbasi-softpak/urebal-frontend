import {DashboardPage} from "../../Dashboard/dashboard.po";
import {browser, by, element, ExpectedConditions} from "protractor";

export class SecurityPage extends DashboardPage{
  navigateToSecurityMasterList(){
    return browser.get('/app/secure/security/master');
  }

}
