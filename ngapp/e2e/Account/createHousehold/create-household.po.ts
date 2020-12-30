import {browser, element, by, Key, protractor, ExpectedConditions, By} from "protractor";
import {DashboardPage} from "../../Dashboard/dashboard.po";
import {until} from "selenium-webdriver";
import elementIsVisible = until.elementIsVisible;
import {waitForElement} from "../../_helpers/helper.func";
import {timeoutWait} from "../../_helpers/timeouts";

export class CreateHousehold extends DashboardPage {
  navigateToCreateHouseholdPage() {
    return browser.get('/app/secure/accounts/createHousehold');
  }


  inputAccount(input: string) {
    var searchBox = element(by.css('#text-input-01'));
    waitForElement(searchBox, timeoutWait);
    searchBox.click().then(()=>{
      searchBox.clear();
      searchBox.sendKeys((input));
    })




  }

  getAccountTitle() {

    var el=element.all(By.css("div[role='gridcell']")).get(1).getAttribute('title');
    el.then(console.log);
    return el;
  }

  getHouseholdPageHeading() {
    browser.sleep(1000);

    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-household > div.slds-grid.slds-wrap.slds-m-around_medium > div > div > div > div.slds-grid.slds-grid--vertical-align-center > div > h3')).getText();
  }

  getHouseholdNameLabel() {
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-household > div.slds-grid.slds-wrap.slds-m-around_medium > div > div > div > fieldset > div > div > div > label.slds-form-element__label.slds-text-title--caps')).getText();
  }

  inputHousehold(s: string) {
    var inputTextBox=element(By.id('houseHoldName'));
    inputTextBox.click().then(()=>{
      inputTextBox.clear();
      inputTextBox.sendKeys(s);
    })
  }

  selectAccountsToHousehold(s: string, s2: string) {
    this.inputAccount(s);
    this.clickAccountCheckBox();//.then(()=>{
    this.inputAccount(s2);
    this.clickAccountCheckBox();
  //  })

  }

  private clickAccountCheckBox() {
    var checkBox = element.all(By.css("div[role='gridcell']")).get(0);
    browser.wait(ExpectedConditions.elementToBeClickable(checkBox), 5000).then(() => {
      checkBox.click();

  }
    )}

  getHouseholdRestrictionError() {
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-create-household > div.slds-grid.slds-wrap.slds-m-around_medium > div > div > div > fieldset > div > div > div > label.slds-text-color--error')).getText();
  }

  createHousehold() {
    browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    this.clickCreateHouseholdButton().then(()=>
    {
      this.assertYesButton();
      this.assertOkButton();


    })
  }

  private clickCreateHouseholdButton() {
    return element(By.partialButtonText('Create Household')).click();
  }

  private assertYesButton() {
    browser.sleep(1000);
    return element(By.partialButtonText('YES')).click();
  }

   assertOkButton() {
    browser.sleep(1000);
    return element(By.css('#modal2 > div.slds-modal.add-rebalance-model.modal-modal2.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button')).click();

  }

  clickSuccessOk() {
    browser.sleep(500);
    element(By.css('#successHouseholdChangesModel > div.slds-modal.add-rebalance-model.modal-successHouseholdChangesModel.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button')).click();
  }
}
