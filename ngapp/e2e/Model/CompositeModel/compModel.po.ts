import {DashboardPage} from "../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class CompositeModelPAge extends DashboardPage {

  navigateToCompositeModelPage() {
    return browser.get('/model/compositemodel');
  }
}
