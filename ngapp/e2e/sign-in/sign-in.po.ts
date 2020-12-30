import { by, element, browser } from 'protractor';
import { timeoutSignIn } from '../_helpers/timeouts';
import { NavigatablePage } from '../_helpers/navigatablePage.class';

export class SignInPage extends NavigatablePage {
  companyNameElem;
  usernameElem;
  passwordElem;
  error;
  captchaElem;
  loginBtnElem;
  urlPath = '/app/user/login';
  componentSelector = 'urebal-login';

  constructor() {
    super();
    this.companyNameElem = element(by.id('companyName'));
    this.usernameElem = element(by.id('username'));
    this.passwordElem = element(by.id('password'));
    this.error = element(by.id('lblMsg'));
    this.captchaElem = element(by.id('captchaContainer'));
    this.loginBtnElem = element(by.id('loginButton'));
  }

  async signIn (company = "softpak", username = "urebal", password = "Urebal@123") {
    this.companyNameElem.clear().sendKeys(company);
    this.usernameElem.clear().sendKeys(username);
    this.passwordElem.clear().sendKeys(password);

    this.loginBtnElem.click();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeoutSignIn);
    });
  }
}
