import {RebalancePage} from "./list.po";
import {browser, By, element, ExpectedConditions} from "protractor";

describe('Rebalance page navigation', function () {
  let rebalanceList: RebalancePage;
  beforeEach(() => {
    rebalanceList = new RebalancePage();
  });
  it('Navigate to rebalance list by URL', () => {
    browser.waitForAngular();
    rebalanceList.navigateToRebalanceList();
    expect(browser.getCurrentUrl()).toContain('rebalance/list');

  })
  it('Verify rebalance details in the list', () => {
    var [rebName, Accounts, households] = rebalanceList.verifyRebalanceListDetails('NW_ACCT_REBALANCE03');
    expect(rebName).toEqual('NW_ACCT_REBALANCE03');
    expect(Accounts).toEqual('1');
    expect(households).toEqual('0');
  })
  it('Verify rebalance associated account and model', () => {
    rebalanceList.navigateToRebalanceDetailsScreen('NW_ACCT_REBALANCE03');
    browser.sleep(2000);
    expect(rebalanceList.getRebalanceName()).toEqual('Rebalance Name: NW_ACCT_REBALANCE03');
    expect(rebalanceList.getAccountName()).toEqual('ACCOUNT_0000110');
    expect(rebalanceList.getTaxStatus()).toEqual('Taxable');
    expect(rebalanceList.getModelName()).toEqual('NW_SEC_MODEL01');
  })
  it('Verification of rebalance execution and reports generation', () => {

    expect(rebalanceList.executeRebalance()).toContain('Rebalance has completed successfully');
    rebalanceList.clickviewReportsButton();
    expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
    rebalanceList.clickTaxSummaryTab();
    expect(rebalanceList.getScopeTextValueTaxSummaryTab()).toContain('ACCOUNT_0000110');
    expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
    rebalanceList.clickAccountSummaryTab().then(() => {
      expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
      expect(rebalanceList.getAccountIdFromSummaryTab()).toEqual('ACCOUNT_0000110');
    })
    rebalanceList.clickSharelotReportTab().then(() => {
      expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
      rebalanceList.getAccountIdColumnValuesSharelotReport((accountId) => {
        expect(accountId).toContain('ACCOUNT_0000110');
      });
    });
    rebalanceList.clickStockReportTab().then(() => {
      expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
    });
    rebalanceList.clickAssetAllocationTab().then(() => {
      expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
      expect(rebalanceList.getAccountIdFromAssetAllocationTab()).toContain('ACCOUNT_0000110');
    })
  rebalanceList.clickEditTradeTab().then(() => {
      expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
      expect(rebalanceList.getScopeTextValueTradeOverrideTab()).toContain('ACCOUNT_0000110');
      expect(rebalanceList.getSaveChangesButton()).toBeTruthy();})
    rebalanceList.clickTradeReasoningTab().then(()=>{
      expect(rebalanceList.getAccountTitle()).toContain('ACCOUNT_0000110');
      // rebalanceList.clickGenerateReportButton().then(() => {
      //   browser.sleep(2000);
      //   rebalanceList.getAccountIdColumnValuesTradeReasoningTab(accountId => {
      //     expect(accountId).toContain('FIRM01_ACCOUNT_00001');
      //   })
      // })
    })


  })
})
