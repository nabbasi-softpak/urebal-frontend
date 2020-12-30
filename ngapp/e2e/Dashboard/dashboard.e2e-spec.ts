import {DashboardPage} from "./dashboard.po";
import {browser, ExpectedConditions, protractor} from "protractor";
import {URebalPage} from "../app.po"
import {before} from "selenium-webdriver/testing";
import {reachGuardedPage} from "../_helpers/reachPage.helper";

describe('Dashboard page navigation', function () {
  let dashboard: DashboardPage;
  beforeAll(async () => {
    dashboard = new DashboardPage();
    await reachGuardedPage(dashboard);
  });
  it('Url should contain dashboard', () => {

    expect(browser.getCurrentUrl()).toContain('dashboard');
  });
  it('should have account widget', async() => {
    // TODO: add checkup for account widget grid.
    expect(await dashboard.getWidget("account").isPresent()).toEqual(true);
  });

  it('should have app-driftreport-summary widget', async() => {
    // TODO: add checkup for app-driftreport-summary widget grid.
    expect(await dashboard.getWidget("app-driftreport-summary").isPresent()).toEqual(true);
  });

  it('should have model widget', async () => {
    // TODO: add checkup for model widget grid.
    expect(await dashboard.getWidget("model").isPresent()).toEqual(true);
  });

  it('should have security widget', async () => {
    // TODO: add checkup for security widget grid.
    expect(await dashboard.getWidget("security").isPresent()).toEqual(true);
  });

 /* it('Click on dashboard icon', () => {
browser.waitForAngularEnabled(false);
    dashboard.getDashboardIcon().click();
    expect(browser.getCurrentUrl()).toContain('dashboard');
  })*/


})


/*const ECt=protractor.ExpectedConditions;
  browser.wait(ECt.urlContains('accounts/list'),2000).then(function(result){
    expect(result).toEqual(true);
  })*/


