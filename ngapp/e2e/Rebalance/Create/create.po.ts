import {DashboardPage} from "../../Dashboard/dashboard.po";
import {browser, by, By, element, ExpectedConditions, protractor} from "protractor";
import {equal} from "assert";
import {selector} from "rxjs/operator/publish";
import {ActionSequence} from "selenium-webdriver";
import {instantiateSupportedAnimationDriver} from "@angular/platform-browser/animations/src/providers";
import {buildDriverProvider} from "protractor/built/driverProviders";
import {Driver} from "selenium-webdriver/chrome";

export class CreateRebalancePage extends DashboardPage {
  navigateToCreateRebalancePage() {
    return browser.get('/app/secure/rebalances/rebalance');
  }

  getRebalancePageHeading() {
    browser.sleep(1000);
    var heading = element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div.slds-grid.slds-wrap.slds-m-around--medium > div > div > div > div.slds-grid.slds-grid--vertical-align-center > div > h3'));
  //  heading.getText().then(console.log);
    return heading.getText();

  }

  getNameThisRebalanceLabel() {
    var heading = element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div:nth-child(2) > div > div:nth-child(1) > div.slds-grid > div.slds-size--4-of-12 > fieldset > div > div:nth-child(1) > label'));
   // heading.getText().then(console.log);
    return heading.getText();
  }

  getfilterAccountHeading() {
    var head = element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div:nth-child(2) > div > div:nth-child(1) > app-criteria-builder > div.slds-page-header.color-white > div > div.slds-col.slds-size--3-of-4 > div > div > h3'));
   // head.getText().then(console.log);
    return head.getText();
  }

  inputRebalanceName(s: string) {
    var inputName = element(By.id('input-01'));
    inputName.click().then(() => {
      inputName.clear();
      inputName.sendKeys(s);

    })

  }


  selectAccountFilter() {

    return element(By.id('accName')).click();
  }

  verifyRebalanceNameAsNew() {
    browser.sleep(500);
    var text=element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div:nth-child(2) > div > div:nth-child(1) > fieldset > div:nth-child(2) > label'));
   // var text = element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div:nth-child(2) > div > div:nth-child(1) > div.slds-grid > div.slds-size--8-of-12'));

   // text.getText().then(console.log);
    return text.getText();
  }

  dropDownCriteriaSelection(stringValue) {

    return element(By.tagName('[name="operator"]')).element(by.xpath('//option[. ="' + stringValue + '"]')).getText().then(console.log);//.click();

  }

  accountFilterCriteria(s: string, s2: string) {
    this.excludeAccounts();//.click();
    this.dropDownCriteriaSelection(s);
    this.inputAccountName(s2)
    this.clickApplyButton();
    this.selectAccountInRebalance();
    this.continueTorebalanceCreationButton();

  }

  private inputAccountName(s2: string) {
    browser.sleep(1000);
    var accountNameTextBox = element(By.id('accountName-0'));
    accountNameTextBox.click().then(() => {
      accountNameTextBox.sendKeys(s2);
    })
  }


  private clickApplyButton() {
    element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div:nth-child(2) > div > div:nth-child(2) > div > div > div.slds-col--bump-left > button')).click();
    browser.sleep(5000);
  }

  private selectAccountInRebalance() {
    var checkBox = element.all(By.css("div[role='gridcell']")).get(0);
    browser.wait(ExpectedConditions.elementToBeClickable(checkBox), 5000).then(() => {
      checkBox.click();
    })


  }

  private continueTorebalanceCreationButton() {
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div:nth-child(3) > div:nth-child(2) > div > div.slds-size--1-of-1 > div > div > div.slds-col--bump-left > button')).click();
  }

  private excludeAccounts() {
    var checkbox=element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-workspace > div:nth-child(2) > div > div:nth-child(1) > app-criteria-builder > div.slds-page-header.color-white > div > div.slds-col.slds-size--3-of-4 > div > div > div > span > label > span.slds-checkbox--faux'));


    browser.wait(ExpectedConditions.visibilityOf(checkbox),5000).then(()=> {
      return checkbox;
    })
  }

  assignModeltoRebalance(s: string) {
    browser.sleep(2000);
//browser.waitForAngular();/html/body/urebal-app/block-ui/div[2]/div/app-execute-workspace/app-expandable-settings/div/app-rebalance-settings/div/div/div[3]/div/button[2]
    var accountNameDiv = this.getJqxWidgetColContentsDiv(4);
    accountNameDiv.click().then(() => {
      this.modelInputTextBox(s);
      browser.sleep(1000);
      this.saveRebalanceAccountsSettingsButton().click().then(()=>{
 browser.sleep(2000);
      })
      //
    })
  }

  getJqxWidgetColContentsDiv(columnTitle) {
    var rows = element.all(By.css('div[id^=contenttablejqxWidget] div[role=row] div:nth-child(' + columnTitle + ') > div'));
    return rows;
  }

  private modelInputTextBox(s2: string) {
    browser.sleep(2000);
    element.all(By.xpath(''))
    var modeltextBox = element(By.css('jqxinput#rebalanceModel')).element(By.tagName('input'));//.clear().then(()=>{
    modeltextBox.getText().then(console.log);

    if (modeltextBox.isEnabled()) {
      //modeltextBox.getText().then(console.log);
      modeltextBox.click().then(() => {
        browser.sleep(2000);
        modeltextBox.clear();
        modeltextBox.sendKeys(s2);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    //    browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");

        // return;
      })

    }


  }

  private saveRebalanceAccountsSettingsButton() {
    browser.sleep(500);
    browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-execute-workspace > app-expandable-settings > div > app-rebalance-settings > div > div > div:nth-child(3) > div > button.slds-button.slds-button--urebal'));

  }
}
