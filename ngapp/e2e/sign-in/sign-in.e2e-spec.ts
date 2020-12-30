import { SignInPage } from './sign-in.po';
import { reachPublicPage } from '../_helpers/reachPage.helper';
import { DashboardPage } from '../dashboard/dashboard.po';
import { SignedInPage } from "../signed-in/signed-in.po";
import {browser} from "protractor";

describe('SignInPage', () => {
  let page: SignInPage;
  let dashboardPage: DashboardPage;
  let signedInPage: SignedInPage;

  beforeAll(async () => {
    page = new SignInPage();
    dashboardPage = new DashboardPage();
    signedInPage = new SignedInPage();

    signedInPage.signOutIfPresent();
    await reachPublicPage(page);
  });

  it('should fail on empty field', async () => {
    await page.signIn("","","");
    expect(await page.error.getText()).toEqual("Please enter company name/username/password.");
  });

  it('should fail on empty username/password', async () => {
    await page.signIn("softpak","","");
    expect(await page.error.getText()).toEqual("Please enter username.");
  });

  it('should fail on empty password', async () => {
    await page.signIn("softpak","urebal","");
    expect(await page.error.getText()).toEqual("Please enter password.");
  });

  it('should fail on wrong credential', async () => {
    await page.signIn("softpak","urebal","wrong");
    expect(await page.error.getText()).toEqual("The login credentials are invalid. Please provide valid credentials to continue.");
  });

  // IGNORE: Ignoring because it lock down other test cases.
  xit('should enable captcha when failed thrice', async () => {
    await page.signIn("softpak","urebal","wrong");
    await page.signIn("softpak","urebal","wrong");
    await page.signIn("softpak","urebal","wrong");
    expect(page.captchaElem.parent().getAttribute("class")).toBe("");
  });

  it('should sign in', async () => {
    await page.signIn("softpak","urebal","Urebal@123");
    expect(await dashboardPage.isOn()).toEqual(true);
  });
});
