
import {URebalPage} from './app.po';
import {browser, by, element, protractor} from "protractor";
import {LoginComponent} from "../src/app/user/login/login.component";
import {until, WebElement} from "selenium-webdriver";
import elementIsDisabled = until.elementIsDisabled;
import {viewClassName} from "@angular/compiler";

describe('Login page', () => {
  let page: URebalPage;

  beforeAll(() => {
    page = new URebalPage();

  });
  it('verifying heading of login page', async () => {
    browser.driver.manage().window().maximize();
    page.navigateTo();

    expect((await page.getParagraphText())).toEqual('Secure Login');
  });

  /*it('Login page displayed', () => {
    browser.driver.manage().window().maximize();
    page.navigateToBasePage();
    expect(page.getParagraphText()).toEqual('Secure Login');
  });
  it('should have login URL', () => {
    expect(browser.getCurrentUrl()).toContain('login')
  });
  it('Login with correct credentials', () => {

    page.setFirmName("softpak");
    page.setuserName("urebal");
    page.setPassword("Urebal@123");
    page.login().click();
    const EC=protractor.ExpectedConditions;
    browser.wait(EC.urlContains('dashboard'),5000).then(function(result){
      expect(result).toEqual(true);
    })

  });
*/
})



/*it('Login with incorrect firmname,error message display', () => {
   page.logOut().click();
    page.navigateTo();
   page.setFirmName("softdrink");
   page.setuserName("urebal");
   page.setPassword("Urebal@123");
   page.login().click();
   expect(page.getLabel().getText()).toContain("The login credentials are invalid.");
 });
 it('Login with incorrect username,error message display', () => {
   page.setFirmName("softpak");
   page.setuserName("urbal");
   page.setPassword("Urebal@123");
   page.login().click();
   expect(page.getLabel().getText()).toContain("The login credentials are invalid.");
 });*/
/* it('Login with incorrect password,error message display', () => {
   page.setFirmName("softpak");
   page.setuserName("urebal");
   page.setPassword("Urebal23");
   browser.waitForAngular();
   page.login().click();
   //browser.driver.manage().timeouts().implicitlyWait(2000);
   expect(page.getLabel().getText()).toContain("The login credentials are invalid.");
 });

 it('Presence of captcha after three attempts', () => {
   expect(page.captchaContainer().getAttribute('class')).toContain('slds-hide');//.then( (value) => {expect(value).toContain('slds-hide');
   page.login().click();
   expect(page.captchaContainer().getAttribute('class')).toBe('');//.then((va) => expect(va).toBe(''));
   expect(page.login().isEnabled()).toBeFalsy();
   expect(page.captcha().getAttribute('class')).toBeDefined();
       });*/




