import { timeoutSignIn } from './timeouts';
import { browser, by, element } from 'protractor';

export class NavigatablePage {
  urlPath: string;
  componentSelector: string;

  async navigateTo () {
    return browser.get(this.urlPath);
  }

  async isOn () {
    try {
      await browser.wait(async () => {
        return await element(by.css(this.componentSelector)).isPresent();
      }, timeoutSignIn, 'Wait for page to be On');
      return true;
    } catch (error) {
      return false;
    }
  }
}
