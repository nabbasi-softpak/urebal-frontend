import {browser, element, by, Key, protractor, ExpectedConditions, By, $$} from "protractor";
import {DashboardPage} from "../../Dashboard/dashboard.po";
import {forEach} from "@angular/router/src/utils/collection";
import {gridFilter} from "../../../src/app/shared/components/urebal-grid/urebal-grid.component";
import {rootRoute} from "@angular/router/src/router_module";
import {until} from "selenium-webdriver";
import alertIsPresent = until.alertIsPresent;
import moment = require("moment");
import CustomMatcherFactory = jasmine.CustomMatcherFactory;
import {isUndefined} from "util";
import {waitForElement} from "../../_helpers/helper.func";
import {timeoutWait} from "../../_helpers/timeouts";

export type DateStr = string;// & DateStrBrand;


export class AccountPage extends DashboardPage {

  /*constructor(){
    super();


    const  matcherColumn:jasmine.CustomMatcherFactories={

      toEqualEachCellInColumn: () =>{
        return {
          compare:(actual,columnLabel)=> {
            if(isUndefined(columnLabel)) columnLabel='';
            let result:jasmine.CustomMatcherResult={
              pass:false,
              message:''};

            var jqxColContentsDiv = this.getJqxWidgetColContentsDiv(columnLabel);
            jqxColContentsDiv.count().then(function (size) {
              for (var i = 0; i < size; i++) {
                var cellValue = jqxColContentsDiv.get(i).getText();
                cellValue.then(console.log);
                result.pass =expect(cellValue).toEqual(actual);

              }
            });
            console.log(result.pass);
            return result;
          }
        }
      }
    };}*/

  navigateToAccountListPage() {
    return browser.get('/app/secure/account/list');
  }

  searchAccount(account) {
    var searchBox = element(by.css('#text-input-01'));
    waitForElement(searchBox, timeoutWait);
    searchBox.click();
    //  searchBox.clear();
    searchBox.sendKeys(account);
  }

  accountSettings(accountName) {
    browser.sleep(2000);
    this.searchAccount(accountName);


    element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-account-detail > div > div:nth-child(1) > div > div > div > div > div > div.slds-p-around--medium.color-white > ul > li:nth-child(3) > a')).click();
    var securityInp = element(By.css('#restrictions > app-restrictions > div:nth-child(2) > fieldset > table > tbody > tr > td:nth-child(1) > app-autocomplete > div'));
    var input = securityInp.element(By.tagName('input'));
    input.click();
    input.sendKeys('A1');
    browser.sleep(1000);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    element(By.css('#restrictionSelectbox > option:nth-child(2)')).click();
    element(By.css('#restrictions > app-restrictions > div:nth-child(2) > fieldset > table > tbody > tr > td:nth-child(5) > button')).click();
    element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-account-detail > div > div:nth-child(2) > div > button.slds-button.slds-button--urebal.actionButton')).click();

    browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    browser.sleep(2000);
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-account-detail > div > div:nth-child(2) > div > label')).getText();

  }

  OutOfTolerance() {

  }

  getJqxWidgetColContentsDiv(columnTitle) {
    var rows = element.all(By.css('div[id^=contenttablejqxWidget] div[role=row] div:nth-child(' + columnTitle + ') > div'));
    return rows;
  }

  /* row() {
     var row=element.all(By.css("div[role='row']"));

       return row;
       }
 */


  filter(s) {

    var errButton = element(By.id(s));
    browser.wait(ExpectedConditions.elementToBeClickable(errButton), 5000).then(() => {
      return errButton.click();
    })
  }


  driftValueInput(s) {

    var percent = element(By.id('driftgreater'));
    percent.clear().then(function () {
        percent.sendKeys(s);


      }
    )
  }

  refresh() {
    return element(By.css('#grid-header-driftsList > div > div:nth-child(3) > button')).click();
  }

  runDrift() {
    var errButton = element(By.css('#grid-header-driftsList > div > div:nth-child(2) > button'));
    browser.wait(ExpectedConditions.elementToBeClickable(errButton), 5000).then(() => {
      errButton.click();
      browser.sleep(5000);
      this.ok();
    })
  }

  clickAccount() {
    var account = element.all(By.css("div[role='gridcell']")).get(1);
    // var account=element.all(By.xpath("//*[text()='" + accountName + "']")).get(1);
    //account.click().then(console.log);
    account.click();
  }

  verifyDate() {
    browser.sleep(2000);
    return element(By.css('#grid-header-driftsList > div > div.slds-col > div > div > h4'));
  }

  ok() {
    browser.wait(ExpectedConditions.alertIsPresent(), 10000).then(() => {
      var abc = browser.switchTo().alert();
      abc.getText().then(console.log);
      abc.accept();
    })
  }

  getDate() {
    var dated = moment(new Date()).format('MMM DD, YYYY hh:mm A');
    console.log(dated);
    return dated;
  }


  assertColumnValueForEachRow(testValueFunction: (drift) => any) {
    var jqxColContentsDiv = this.getJqxWidgetColContentsDiv(5);
    jqxColContentsDiv.count().then(function (size) {
      for (var i = 0; i < size; i++) {
        var cellValue = jqxColContentsDiv.get(i).getText();
      //  cellValue.then(console.log);
        testValueFunction(cellValue);
      }
    })
  }

  assertDriftPercentage(testValueFunction: (drift) => any) {
    var jqxColContentsDiv = this.getJqxWidgetColContentsDiv(6);
    jqxColContentsDiv.count().then(function (size) {
      for (var i = 0; i < size; i++) {
        var cellValue = jqxColContentsDiv.get(i).getText();
     //   cellValue.then(console.log);
        testValueFunction(cellValue);
      }
    })
  }

  verifyDriftRunDate(expectFunction: (date1) => any) {
    var drift = this.verifyDate();
    var date1 = drift.getText();
   // date1.then(console.log);
    expectFunction(date1);
  }

  verifyAccountName(expectFunction: (drift) => any) {

    var stats = this.getJqxWidgetColContentsDiv(2);
    stats.count().then(function (size) {
      var length = size;
      //console.log(size.toString());
      for (var i = 0; i < length; i++) {
        var drift = stats.get(i).getText();
      //  drift.then(console.log);
        expectFunction(drift);
      }
    })

  }

  verifyTaxStatus(expectFunction: (drift) => any) {

    var stats = this.getJqxWidgetColContentsDiv(4);
    stats.count().then(function (size) {
      var length = size;
      for (var i = 0; i < length; i++) {
        var drift = stats.get(i).getText();
       // drift.then(console.log);
        expectFunction(drift);
      }
    })
  }

  clickOutOfToleranceButton() {
    this.filter('out_of_tolerance');
  }

  deleteHouseholdIfExist(s) {
    this.navigateToAccountListPage();
    browser.waitForAngularEnabled(false);
    this.searchAccount(s);
    this.deleteHousehold();


  }

  private moveToAccountsProfileTab() {

    this.clickAccount();
    browser.sleep(1000);
  }

  private deleteHousehold() {
    var account = element.all(By.css("div[role='gridcell']")).get(1).click().then(() => {
      this.deleteExistingHousehold();
    }, function () {
      console.log('Household not present already');
      throw '';
    }).catch(reason => {

    });

  }

  private clickEditButton() {
    browser.sleep(2000);
    return element(By.partialButtonText('Edit')).click();
  }

  private clickClearAccountButton(c) {
    return element(By.id('btnMarkForDeletion' + c + '')).click();
  }

  private clickSaveButton() {
    browser.sleep(500);
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-account-detail > div > div:nth-child(1) > div > div > div > div.slds-size--2-of-12.tiny-sidebar > div.collapsed-sidebar.slds-p-around--small > div > div.slds-text-align--right > button.slds-button.slds-button--urebal')).click();
  }

  private assertYesButton() {
    browser.sleep(1000);
    return element(By.css('#saveHouseholdChangesModal > div.slds-modal.add-rebalance-model.modal-saveHouseholdChangesModal.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button:nth-child(2)')).click();
  }

  private deleteExistingHousehold() {
    browser.sleep(2000);
    this.clickEditButton().then(() => {
      browser.sleep(1000);
      this.clearAccountsFromHousehold();
      this.clickSaveButton().then(() => {
        this.assertYesButton();
      })
    })

  }

 /* private clearAccountsFromHousehold() {



  }*/

 // })}

  addAccountInHousehold(s: string) {
    browser.waitForAngularEnabled(false);
    element.all(By.css("div[role='gridcell']")).get(1).click().then(() => {
      browser.sleep(1000);
      this.clickEditButton().then(() => {
        this.addAccount(s);


      })
    })
  }

  private addAccount(s: string) {
    this.inputAccountInAutoComplete(s)
  }

  private inputAccountInAutoComplete(s: string) {
    var textInput = this.getAutocompleteInputTextBox();

    textInput.sendKeys(s).then(() => {
      browser.actions().sendKeys(protractor.Key.ENTER).perform();
      this.clickSaveButton();
      this.assertYesButton();

      var successText = this.getSuccessMessage();
      return successText;
    })
  }

  private getAutocompleteInputTextBox() {
    return element((By.id('autocomplete-accountname')));
  }

  private clickYesButton() {
    browser.sleep(500);
    return element(By.css('#saveHouseholdChangesModal > div.slds-modal.add-rebalance-model.modal-saveHouseholdChangesModal.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button:nth-child(2)')).click();
  }

  getSuccessMessage() {
    browser.sleep(1000);
    return element(By.css('#successHouseholdChangesModel > div.slds-modal.add-rebalance-model.modal-successHouseholdChangesModel.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__content.slds-text-align--center.slds-p-around--medium > p')).getText();
  }

  clearAccountsFromHousehold() {
//  var list= element(By.className('slds-has-dividers--bottom-space accounts-selection'));
   // browser.sleep(2000);
  // var listElements = element.all(By.className('slds-item menuitem')).count().then(function (size) {
    //  var length = size;
      for (var i = 0; i < 2; i++) {
        this.clickClearAccountButton(i);
      }
   //});//
  }
  getAccountCount(){
    browser.sleep(250);
return element.all(By.className('slds-item menuitem')).count();
    }





  //for(var i=0;icount;i++){

//  }
 // listElements.getText().then(console.log);


/*elements.count().then(console.log);
return elements.count();*/
 //  return list.count();
   // element.all(By.className('.slds-has-dividers--bottom-space accounts-selection'));//.getSize();

  removeAccountFromHousehold() {
browser.waitForAngularEnabled(false);
browser.sleep(1000);
this.clickEditButton().then(()=>{
  this.clickClearAccountButton(0);
  this.clickSaveButton().then(() => {
    this.assertYesButton();

  })





})
  }
}

