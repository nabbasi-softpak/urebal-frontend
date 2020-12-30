import {DashboardPage} from "../Dashboard/dashboard.po";
import {browser, by, element, ExpectedConditions} from "protractor";

export class SettingsPage extends DashboardPage{
  navigateToImportPage(){
return browser.get('/app/secure/imports');
  }

}
