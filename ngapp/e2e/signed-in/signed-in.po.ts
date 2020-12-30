import { by, element } from 'protractor';
import {timeoutSignOut, timeoutWait} from '../_helpers/timeouts';
import { NavigatablePage } from '../_helpers/navigatablePage.class';
import {clickWhenClickable, waitForClickable} from "../_helpers/helper.func";

export class SignedInPage extends NavigatablePage {
  urlPath = '/app/secure/dashboard';
  componentSelector = 'urebal-topbar .navigation';

  async signOut () {
    await clickWhenClickable(this.getSettingMenu(), timeoutWait);
    await clickWhenClickable(this.getSignOutButton(), timeoutWait);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeoutWait);
    });
  }

  async signOutIfPresent () {
    const signOutButton = this.getSignOutButton();
    if (await signOutButton.isPresent()) {
      return this.signOut();
    }
  }

  hasSidebar () {
    return element(by.css('urebal-sidebar')).isDisplayed();
  }

  navigateToDashboard () {
    this.getMenuItemDashboard().click();
  }

  getSettingMenu() {
    return element(by.css('#urUserMenuContainer .slds-dropdown-trigger'));
  }

  private getMenuItemDashboard () {
    return element(by.css('#dashBoardLink a'));
  }

  private getSignOutButton () {
    return element(by.id('logout-btn'));
  }
}
