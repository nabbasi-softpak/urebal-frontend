import {SettingsPage} from "./settings.po";
import {browser, ExpectedConditions} from "protractor";

describe('Navigate to settings page',function () {
  let setting: SettingsPage;
  beforeAll(() => {
    setting = new SettingsPage();
  });
  it('Navigate to data import page by URL', () => {
    setting.navigateToImportPage();
    expect(browser.getCurrentUrl()).toContain('app/secure/imports');
  });

});
