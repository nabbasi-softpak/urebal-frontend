import {DashboardPage} from "../../Dashboard/dashboard.po";
import {browser, by, By, element, ExpectedConditions, protractor} from "protractor";
import {until, WebElement} from "selenium-webdriver";
import {stringifyElement} from "@angular/platform-browser/testing/src/browser_util";
import {type} from "os";
import {StringifyOptions} from "querystring";
import {forEach} from "@angular/router/src/utils/collection";
import {summaryFileName} from "@angular/compiler/src/aot/util";
import titleContains = until.titleContains;
import titleIs = until.titleIs;
import {waitForElement} from "../../_helpers/helper.func";
import {timeoutWait} from "../../_helpers/timeouts";

export class ModelPage extends DashboardPage {

  navigateToModelList() {
    return browser.get('/app/secure/model/list');
  }

  searchModel(modelName) {
    var searchBox = element(by.css('#text-input-01'));
    waitForElement(searchBox, timeoutWait);
    searchBox.click().then(() => {
      searchBox.sendKeys(modelName);
    })
  }

  getModelRow() {
    browser.sleep(1000);
    var model = element.all(By.css("div[role='gridcell']"));
    return model;

  }

  verifyModelName() {
    browser.sleep(1000);
    return element(by.css('body > urebal-app > block-ui > div.drawer-container > div > app-model-detail > div:nth-child(1) > div > div.slds-page-header.color-white > div > div:nth-child(1) > div > div > h1'));

  }

  verifyAttributes(j) {

    /* for (var j = 0; j < 3; j++) {
       let val = element(By.xpath('//!*[@id="' + j + '"]/div[1]/h3')).getText();
       //val.then(console.log);
       str1 = str1.concat(val[0]);
       return [[val], str1];


     // var block=element(By.xpath('/html/body/urebal-app/block-ui/div[2]/div/app-model-detail/div[2]/div['+a+']'));*/

    let attr = element(By.xpath('//*[@id="' + j + '"]/div[1]/h3'));
    ;
    // typeof attr.then(console.log)
    return attr;

  }

  verifySubmodels(m) {
    browser.sleep(1500);
    var submodel = element(By.id('submodels-' + m + ''));

    submodel.getText().then(console.log);


    return submodel;


  }


  verifyChart() {
    return element(By.css('#pie > svg'));

  }

  chartAppear() {
    browser.sleep(500);
    var chart = element(By.xpath('//*[@id="svgChart"]'));
    chart.getText().then(console.log);
    return chart.getText();

  }

  verifyButton() {

    var stack = element(By.xpath('//*[@id="stack"]'));
    stack.click();


    /*   var text = element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-model-detail > div:nth-child(1) > div > div.slds-page-header.color-white > div > div.slds-col.slds-grid--vertical-align-center.slds-grid--align-spread > div > div:nth-child(2) > label > span.slds-form-element__label.slds-m-bottom--none'));
       text.getText().then(console.log);*/
    //return text.getText();

  }


  verifyFlattened() {
    return element(By.xpath('//*[@id="toggle-equivalances"]/span'));

  }

  edit() {
    return element(By.xpath('/html/body/urebal-app/block-ui/div[2]/div/app-model-detail/div[1]/div/div[1]/div/div[3]/div/div[2]/button'));
  }

  verifyEditScreen() {
    this.edit().click();
    browser.sleep(1000);
    browser.waitForAngular();
    var heading = element(By.xpath('/html/body/urebal-app/block-ui/div[2]/div/app-attribute-model/div[1]/div/div/div/div[1]/div/h3'));
    var attrType = element.all(By.id('attributeTypesModel')).get(0);
    //attrType.getText().then(console.log);
    var modelName = element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-attribute-model > div:nth-child(1) > div > div > div > table > tbody > tr > td:nth-child(1) > input'));
    modelName.getText().then(console.log);
    return [heading, modelName, attrType]
  }

  verifyPercentages(j) {
    var attr = element(By.xpath('//*[@id="' + j + '"]/div[1]'));
    var name = attr.element(By.tagName('h3'));
    var per = attr.element(By.xpath('div/div/input'));


    //.getAttribute('ng-reflect-model');
    // var model = element.all(By.css("div[role='gridcell']"));


    return [name, per];
  }

  verifySecurity(count) {
    browser.sleep(1000);
    let b, c, d, e, f, g;

    for (var i = 0; i < count; i++) {
      if (i = 0) {
       // console.log(i);
        var secBlock = element(By.id('AGYCX-block'));

      }
      else if (i = 1) {
        var secBlock = element(By.id('BGEIX-block'));

      }
      else if (i = 2) {
        var secBlock = element(By.id('RING-block'));
      }
      else if (i = 3) {
        var secBlock = element(By.id('ENFC-block'));
      }
      else if (i = 4) {
        var secBlock = element(By.id('WSBF-block'));
      }
      else {
        var secBlock = element(By.id('REMX-block'));
      }
      var securityName = secBlock.element(By.className('iconAlignment slds-truncate slds-m-right--small'));
      var val = secBlock.element(By.className('slds-form--inline'));
      b = val.element(By.name('security.target')).getAttribute('ng-reflect-model');
      c = val.element(By.name('security.min')).getAttribute('ng-reflect-model');
      d = val.element(By.name('security.max')).getAttribute('ng-reflect-model');
      e = val.element(By.name('security.absTarget')).getAttribute('ng-reflect-model');
      f = val.element(By.name('security.absMin')).getAttribute('ng-reflect-model');
      g = val.element(By.name('security.absMax')).getAttribute('ng-reflect-model');
      return [securityName, i, b, c, d, e, f, g];
    }
    /*var POT = block.element(By.id('POT-block')).element(By.className('iconAlignment slds-truncate slds-m-right--small'));
    var ROC = block.element(By.id('ROC-block')).element(By.className('iconAlignment slds-truncate slds-m-right--small'));
    var WLT = block.element(By.id('WLT-block')).element(By.className('iconAlignment slds-truncate slds-m-right--small'));
    return [POT, ROC, WLT];*/
  }


  save() {
    browser.sleep(500);
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-attribute-model > div.slds-grid.slds-wrap.slds-m-around--medium.box.color-white > div > button.slds-button.slds-button--urebal')).click();
   // browser.sleep(1000);
    /* browser.wait(ExpectedConditions.elementToBeClickable(sav),5000).then(()=>
     {
       return sav;
     })*/
    // return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-attribute-model > div.slds-grid.slds-wrap.slds-m-around--medium.box.color-white > div > button.slds-button.slds-button--urebal'));
  }

  addSec(sr1) {

    var comp = element(by.id('attribute_9747'));
    browser.wait(ExpectedConditions.elementToBeClickable(comp), 5000).then(() => {
      comp.click().then(() => {
        comp.sendKeys(sr1);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
      });


    });

    /*secAdd.getAttribute('ng-reflect-placeholder').then(console.log);
        secAdd.click().then(()=>{secAdd.sendKeys(str)});//.then(()=;*/


  }

  setSec(s, val) {
    let a, b, c, d, e, f, g;

browser.sleep(1000);
    var ENR = element(By.id(s + '-block'));
    // var ENR2 = ENR.element(By.className('iconAlignment slds-truncate slds-m-right--small'));
    var val1 = ENR.element(By.className('slds-form--inline'));
    b = val1.element(By.name('security.target'));
    browser.wait(ExpectedConditions.elementToBeClickable(b), 5000).then(() => {
      b.click().then(() => {
        b.clear();
        b.sendKeys(val);
      });
    })

    c = val1.element(By.name('security.min'));
    browser.wait(ExpectedConditions.elementToBeClickable(b), 5000).then(() => {
      c.clear().then(() => {
        c.sendKeys(val);
      });
    });
    d = val1.element(By.name('security.max'));
    browser.wait(ExpectedConditions.elementToBeClickable(b), 5000).then(() => {
      d.clear().then(() => {
        d.sendKeys(val);
      });
    })
  }

  okPop() {
    return element(By.css('#saveModelModal > div.slds-modal.add-rebalance-model.modal-saveModelModal.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button'));
  }

  removeSec(s: string) {

    var but = element(By.css('#RTI-block > div.slds-form--inline > div:nth-child(7) > div > button'));
    but.click();
  }

  clickOk() {
    return element(By.css('#saveModelModal > div.slds-modal.add-rebalance-model.modal-saveModelModal.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button'));

  }

  async deleteModelIfExist(s: string) {
   this.navigateToModelList();
 browser.waitForAngularEnabled(false);
 this.searchModel(s);
    // browser.sleep(1000);
 this.deleteModel();

   /* var settingButton = this.checkModelExistence(s);
  //  if (settingButton) {
    settingButton.click().then(() => {
      console.log('Deleting it');
      this.selectDeleteOption();
      console.log('Model Deleted successfully.')
      }, function () {
        console.log('Model not present already');
        throw '';
      }).catch(reason => {

      });*/

   // }


  }

  /* private deleteModel() {


   }*/

  /*  clickSettingsButton(){
      return
    }*/

  private selectDeleteOption() {
    browser.sleep(1000);
    //  console.log('Deleting model');
    var deleteButton = element(By.partialLinkText('Delete'));
    browser.wait(ExpectedConditions.elementToBeClickable(deleteButton), 2000).then(() => {
      deleteButton.click();

      this.clickYesButton();
      this.clickOkButton();
    });
  }

  private clickYesButton() {
    /*browser.sleep(1000);*/
    var yesButton = element(By.css(' #deleteConfirmationModal > div.slds-modal.add-rebalance-model.modal-deleteConfirmationModal.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button:nth-child(1)'));
    browser.wait(ExpectedConditions.elementToBeClickable(yesButton), 2000).then(() => {
      return yesButton.click();
    });

  }

  private clickOkButton() {
    var okButtonOfDeleteSuccess = element(By.css('#deleteModal > div.slds-modal.add-rebalance-model.modal-deleteModal.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button'));
    browser.wait(ExpectedConditions.elementToBeClickable(okButtonOfDeleteSuccess), 2000).then(() => {
      return okButtonOfDeleteSuccess.click();
    })

  }

  checkModelExistence(s) {
this.navigateToModelList();
browser.waitForAngularEnabled(false);
this.searchModel(s);
    var SettingsButton=element(By.css("[id^=myButton]"));
    SettingsButton.getWebElement().then(()=>{
      console.log('Model present in database');
    });
    return SettingsButton;


  }

  verifySecurityModelDetails(s: string) {
    this.searchModel(s);

  }

  clickModelToViewDetails(s) {
    this.getModelRow().get(2).element(By.partialLinkText(s)).click();
    browser.waitForAngularEnabled(false);
  }
  /* verifySecurity2() {
   browser.sleep(1000);
   let b, c, d, e, f, g;
   var block = element(By.id('7-block'));
   for (var i = 0; i < 2; i++) {
     if (i = 0) {
       var ENR = block.element(By.id('ENR-block'));
     }
     else {
       var ENR = block.element(By.id('WWW-block'));
     }
     var ENR2 = ENR.element(By.className('iconAlignment slds-truncate slds-m-right--small'));
     var val = ENR.element(By.className('slds-form--inline'));
     b = val.element(By.name('security.target')).getAttribute('ng-reflect-model');
     c = val.element(By.name('security.min')).getAttribute('ng-reflect-model');
     d = val.element(By.name('security.max')).getAttribute('ng-reflect-model');
     e = val.element(By.name('security.absTarget')).getAttribute('ng-reflect-model');
     f = val.element(By.name('security.absMin')).getAttribute('ng-reflect-model');
     g = val.element(By.name('security.absMax')).getAttribute('ng-reflect-model');
     return [ENR2, i, b, c, d, e, f, g];
   }*/
  private deleteModel() {
    var settings = element(By.css("[id^=myButton]")).click().then(() => {
      this.selectDeleteOption();
    }, function () {
      console.log('Model not present already');
      throw '';
    }).catch(reason => {

    });
  }
}

