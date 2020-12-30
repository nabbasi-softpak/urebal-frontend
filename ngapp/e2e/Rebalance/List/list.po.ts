import {DashboardPage} from "../../Dashboard/dashboard.po";
import {browser, by, By, element, ExpectedConditions} from "protractor";
import {BROWSER_ANIMATIONS_PROVIDERS} from "@angular/platform-browser/animations/src/providers";
import {elementEventFullName} from "@angular/core/src/view";
import {until} from "selenium-webdriver";
import elementIsEnabled = until.elementIsEnabled;
import {waitForElement} from "../../_helpers/helper.func";
import {timeoutWait} from "../../_helpers/timeouts";


export class RebalancePage extends DashboardPage {
  navigateToRebalanceList() {
    return browser.get('/app/secure/rebalance/list');
  }

  verifyRebalanceListDetails(rebalanceName) {
    let rebName, noOfAccounts, noOfHouseholds;
    this.searchRebalanceInList(rebalanceName);
    var rebalance = this.getRebalanceRow();
    rebName = rebalance.get(1).getAttribute('title');
    noOfAccounts = rebalance.get(2).getAttribute('title');
    noOfHouseholds = rebalance.get(3).getAttribute('title');
    return [rebName, noOfAccounts, noOfHouseholds];

  }

  private searchRebalanceInList(s: string) {
    var searchBox = element(by.css('#text-input-01'));
    waitForElement(searchBox, timeoutWait);
    searchBox.click().then(() => {
      searchBox.sendKeys(s);

    })
  }

  navigateToRebalanceDetailsScreen(s: string) {
    var rebalance = this.getRebalanceRow();
    var rebalanceName = rebalance.get(1).element(By.tagName('a'));
    rebalanceName.click();

  }

  selectAccountInRebalance() {
    var checkBox = element.all(By.css("div[role='gridcell']")).get(0);
    browser.wait(ExpectedConditions.elementToBeClickable(checkBox), 5000).then(() => {
      checkBox.click();
    })
  }

  private getRebalanceRow() {
    return element.all(By.css("div[role='gridcell']"));
  }

  getRebalanceName() {
    return element(By.css('#workspaceDiv > div > div.text-size--heading')).getText();
  }

  getAccountName() {

   // this.getRebalanceRow().get(2).getText().then(console.log);
    return this.getRebalanceRow().get(2).getText();
  }

  getTaxStatus() {
   // this.getRebalanceRow().get(4).getText().then(console.log);
    return this.getRebalanceRow().get(4).getText();
  }

  getModelName() {
   // this.getRebalanceRow().get(5).getText().then(console.log);
    return this.getRebalanceRow().get(5).getText();
  }

  deleteRebalanceIfExist(s: string) {
    this.navigateToRebalanceList();
    browser.waitForAngularEnabled(false);
    this.searchRebalanceInList(s);
    this.deleteRebalance();


  }

  private deleteRebalance() {
    var settings = element(By.css("[id^=myButton]")).click().then(() => {
      this.selectDeleteOption();
    }, function () {
      console.log('Rebalance not present already');
      throw '';
    }).catch(reason => {

    });


  }

  selectDeleteOption() {
    browser.sleep(1000);
    var deleteButton = element(By.partialLinkText('Delete'));
    browser.wait(ExpectedConditions.elementToBeClickable(deleteButton), 2000).then(() => {
      deleteButton.click();

      this.clickYesButton();
      this.clickOkButton();
    });
   // return deleteButton;

  }

  private clickYesButton() {
    browser.sleep(1000);
    var yesButton = element(By.css('#WorkSpaceDeleteWarning > div.slds-modal.add-rebalance-model.modal-WorkSpaceDeleteWarning.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button.slds-button.slds-button--urebal'));
    browser.wait(ExpectedConditions.elementToBeClickable(yesButton), 2000).then(() => {
      return yesButton.click();
    });
  }

  private clickOkButton() {
    var okButtonOfDeleteSuccess = element(By.css('#WorkSpaceDeleteOK > div.slds-modal.add-rebalance-model.modal-WorkSpaceDeleteOK.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button'));
    browser.wait(ExpectedConditions.elementToBeClickable(okButtonOfDeleteSuccess), 2000).then(() => {
      return okButtonOfDeleteSuccess.click();
    })

  }


  executeRebalance() {
    this.selectAccountInRebalance();
    this.getRebalanceExecutionButton().click();//.then(() => {
    browser.sleep(5000);

    // browser.wait(ExpectedConditions.visibilityOf(this.getRebalanceStatusMessage()), 10000).then(() => {
    var rebalanceStatus = this.getRebalanceStatusMessage();
    return rebalanceStatus.getText();//.getText().then(function (txt) {

  }


  getRebalanceExecutionButton() {
    return element(By.css('#workspaceDiv > div > div.slds-size--1-of-1 > div > div > div.slds-col--bump-left > button'));
  }

  getRebalanceStatusMessage() {
    return element(By.xpath('//*[@id="workspaceExecute"]/div[2]/div/div[2]/p'));//
  }

  clickviewReportsButton() {
    try {
      browser.wait(ExpectedConditions.elementToBeClickable(this.getViewReportsButton()), 5000).then(() => {
        this.getViewReportsButton().click();
        //.then(() => {
      })
    }



      /*  browser.wait(ExpectedConditions.elementToBeSelected(this.getAccountTitle().then()),5000).then(()=>

        {
          this.getAccountTitle().getAttribute('title').then(console.log);
        })*/
      // })

    catch (Exception) {

      console.log('Error');
    }

    /*browser.sleep(1000);*/
  }

  private getViewReportsButton() {
    return element(By.css('#workspaceExecute > div.slds-modal.add-rebalance-model.modal-workspaceExecute.slds-modal--small.slds-fade-in-open > div > div.slds-modal__footer > button.slds-button.slds-button--urebal'));
  }

  getAccountTitle() {
    browser.sleep(1000);
    return element(By.css('#projectInformation > table > tbody > tr > td:nth-child(2) > div')).getAttribute('title');
  }

  clickTaxSummaryTab() {
    /*  browser.sleep(500);*/
    return element(By.css('[data-target="tax-summary"]')).click();
  }

  clickAccountSummaryTab() {
    return element(By.css('[data-target="account-summary"]')).click();
  }

  clickSharelotReportTab() {
    return element(By.css('[data-target="sharelot-report"]')).click();
  }

  getAccountIdColumnValuesSharelotReport(testValueFunction: (accountId) => any) {
    var jqxColContentsDiv = this.getJqxWidgetColContentsDiv(1);
    jqxColContentsDiv.count().then(function (size) {
      for (var i = 0; i < size; i++) {
        var cellValue = jqxColContentsDiv.get(i).getText();
        cellValue.then(console.log);
        testValueFunction(cellValue);
      }
    })
  }

  clickStockReportTab() {
    return element(By.css('[data-target="stock-report"]')).click();
  }

  getJqxWidgetColContentsDiv(columnTitle) {
    var rows = element.all(By.css('div[id^=contenttablejqxWidget] div[role=row] div:nth-child(' + columnTitle + ') > div'));
    return rows;
  }

  getAccountIdFromSummaryTab() {
    return element(By.css('#tab-account-summary > table > tbody > tr:nth-child(1) > td:nth-child(2) > div')).getText();
  }

  getScopeTextValueTaxSummaryTab() {
    /*browser.sleep(200);*/
    return element(By.css('#tab-tax-summary > form > div:nth-child(1) > select')).getText();
  }

  clickAssetAllocationTab() {
    return element(By.css('[data-target="asset-allocation"]')).click();
  }

  clickCollapseAllButton() {
    browser.sleep(500);
    return element(By.id('btnCollapseAll')).click();
  }

  getAccountIdFromAssetAllocationTab() {
    browser.sleep(1000);
  //  element.all(By.css('tr[id^=row0jqxWidget]')).get(0).getText().then(console.log);
    return element.all(By.css('tr[id^=row0jqxWidget]')).get(0).getText();
  }

  clickEditTradeTab() {
    return element(By.css('[data-target="trade-override"]')).click();
  }

  getScopeTextValueTradeOverrideTab() {
    // browser.wait(ExpectedConditions.visibilityOf(element(By.css('#tab-trade-override > trade-override > div.slds-grid > div > div.slds-grid.slds-m-bottom--medium > form > div > div > div > select > option'))),10000).then(()=>{
    // element(By.css('#tab-trade-override > trade-override > div.slds-grid > div > div.slds-grid.slds-m-bottom--medium > form > div > div > div > select')).getText().then(console.log);
    return element(By.css('#tab-trade-override > trade-override > div.slds-grid > div > div.slds-grid.slds-m-bottom--medium > form > div > div > div > select')).getText();

    //   })

  }

  getSaveChangesButton() {
    var saveButton = element(By.css('#tab-trade-override > trade-override > div.slds-grid > div > div.slds-size--1-of-3.slds-float--left.actionButtons > button.slds-button.slds-button--urebal'));
    if (saveButton.isEnabled()) {
      return saveButton;
    }
    else return false;
  }

  clickTradeReasoningTab() {
    return element(By.css('[data-target="workspace-swap-details"]')).click();
  }

  clickGenerateReportButton() {
    return element(By.css('#workspaceDetailReport > div > div.slds-page-header.color-white.no-print > div > div > div > div > table > tbody > tr > td:nth-child(4) > button')).click();
  }

  getjqxColumnValAccountId(columnTitle) {
    var rows = element.all(By.css('div[id^=contenttablejqxWidget] > div:nth-child(' + columnTitle + ') > div'));
    return rows;
  }

  getAccountIdColumnValuesTradeReasoningTab(param: (accountId?) => any) {

    browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    browser.sleep(5000);
    var jqxColContentsDiv = this.getjqxColumnValAccountId(4);
//  jqxColContentsDiv.getText().then(console.log);
 //   jqxColContentsDiv.getText().then(console.log);
    jqxColContentsDiv.get(2).getText().then(console.log);
    jqxColContentsDiv.get(3).getText().then(console.log);
//jqxColContentsDiv.count().then(console.log);
  jqxColContentsDiv.count().then(function (size) {
     for (var i = 0; i < size; i++) {
      var cellValue = jqxColContentsDiv.get(0).getText();
   //  cellValue.then(console.log);
        param(cellValue);//.getText());
   }
  })
  }
}
