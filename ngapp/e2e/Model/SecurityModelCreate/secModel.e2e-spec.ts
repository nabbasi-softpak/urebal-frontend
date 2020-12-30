import {browser, by, element, ExpectedConditions} from "protractor";
import {SecurityModelCreate} from "./secModel.po";
import {ModelPage} from "../ModelList/model.po";
import {reachGuardedPage} from "../../_helpers/reachPage.helper";

describe('Security Model page navigation', function () {
  let securityModelCreate: SecurityModelCreate;
  let modelList: ModelPage;
  beforeAll(async () => {
    securityModelCreate = new SecurityModelCreate();
    //await reachGuardedPage(securityModelCreate);
    modelList = new ModelPage();
  });
 /* beforeEach(() => {
    securityModelCreate = new SecurityModelCreate();
    modelList = new ModelPage();
  });*/
  /*it('Navigate to create security model by URL', () => {
     securityModelCreate.navigateToCreateSecurityModelPage();
     expect(browser.getCurrentUrl()).toContain('model/securityModel');
   })*/
  //Create a new Security Model with 2 securities.
  it('should be creating a new security model and verifying it in the list', () => {
    var SecuritiesArray = ['AWAY', 'POT'];
    modelList.deleteModelIfExist('NW_SEC_MODEL01');
    securityModelCreate.navigateToCreateSecurityModelPage().then(() => {
      expect(securityModelCreate.getHeading()).toEqual('Create - Security Model');
      securityModelCreate.inputModelName('NW_SEC_MODEL01');
      securityModelCreate.inputSecuritiesInModel(SecuritiesArray);
     // expect(modelList.checkModelExistence('NW_SEC_MODEL01')).toBeTruthy();
    })
  })
  it('Verifying security model details in the list', () => {
modelList.navigateToModelList();
browser.waitForAngularEnabled(false);
modelList.searchModel('NW_SEC_MODEL01');
    var details = modelList.getModelRow();
browser.waitForAngular();
    expect(details.get(2).getAttribute('title')).toEqual('NW_SEC_MODEL01');
    expect(details.get(3).getAttribute('title')).toEqual('Security Model');
    expect(details.get(4).getAttribute('title')).toEqual('2');
    expect(details.get(5).getAttribute('title')).toEqual('0');
    expect(details.get(6).getAttribute('title')).toEqual('0.00');
    expect(details.get(7).getAttribute('title')).toEqual('0');

  })
 /* it('Verify model details', () => {
    modelList.clickModelToViewDetails('NW_SEC_MODEL01');

    expect(modelList.verifySubmodels(0).getText()).toContain('AWAY\n' +
      'AWAY\n' +
      '--\n' +
      '--\n' +
      '--\n' +
      '50.00\n' +
      '50.00\n' +
      '50.00\n' +
      'POT\n' +
      'POT\n' +
      '--\n' +
      '--\n' +
      '--\n' +
      '50.00\n' +
      '50.00\n' +
      '50.00\n');
  })*/


  // modelList.securitySelect();


})
