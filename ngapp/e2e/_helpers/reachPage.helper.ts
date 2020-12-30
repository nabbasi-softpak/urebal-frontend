import { SignInPage } from '../sign-in/sign-in.po';
import { SignedInPage } from '../signed-in/signed-in.po';
import { browser } from 'protractor';
import { NavigatablePage } from './navigatablePage.class';

export const reachGuardedPage = async (page: NavigatablePage) => {
  browser.waitForAngularEnabled(false); // https://github.com/angular/angularfire2/issues/225
  const signInPage = new SignInPage();
  await page.navigateTo();
  if (await page.isOn()) {
    return;
  }
  await signInPage.signIn();

  if (!await page.isOn()) { // Login auto redirect
    await page.navigateTo();
    if (!await page.isOn()) {
      throw new Error('Can\'t reach required page');
    }
  }

};

export const reachPublicPage = async (page: NavigatablePage) => {
  browser.waitForAngularEnabled(false); // https://github.com/angular/angularfire2/issues/225
  const signedInPage = new SignedInPage();
  await page.navigateTo();
  if (await page.isOn()) {
    return;
  }
  await signedInPage.signOutIfPresent();
  await page.navigateTo();
};
