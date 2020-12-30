import {DashboardPage} from "../../Dashboard/dashboard.po";
import {browser, by, By, element, ExpectedConditions, protractor} from "protractor";
import {Key} from "selenium-webdriver";
import {send} from "q";
// import {Action} from "rxjs/scheduler/Action";
import {BROWSER_ANIMATIONS_PROVIDERS} from "@angular/platform-browser/animations/src/providers";
import {NavigatablePage} from "../../_helpers/navigatablePage.class";

export class SecurityModelCreate extends NavigatablePage {

  navigateToCreateSecurityModelPage() {
    return browser.get('/app/secure/model/securityModel');
  }

  inputSecuritiesInModel(securityArray) {
    browser.sleep(2000);
    var autoCompleteTextBox = this.getSecurityAutoComplete();
    browser.wait(ExpectedConditions.elementToBeClickable(autoCompleteTextBox), 10000).then(() => {
      this.setSecuritiesId(autoCompleteTextBox, securityArray);
      this.setPercentageValuesForEachSecurity();
      this.clickSaveButton();
      browser.waitForAngularEnabled(false);
      this.assertOk();
    })
  }
  getHeading() {
    browser.sleep(2000);
    element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-security-model > div:nth-child(1) > div > div > div > div.slds-grid.slds-grid--vertical-align-center > div > h3')).getText();//.then(console.log);
    return element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-security-model > div:nth-child(1) > div > div > div > div.slds-grid.slds-grid--vertical-align-center > div > h3')).getText();
  }

  inputModelName(s: string) {
    var inputName = element(By.id('input-01'));
    inputName.click().then(() => {
      inputName.clear();
      inputName.sendKeys(s);
//browser.sleep(1000);
    })
  }

  private getSecurityAutoComplete() {
    return element(by.css('#securityAutoComplete'));
  }

  private setSecuritiesId(comp, securityArray) {
    for (var secValueIndex = 0; secValueIndex < 2; secValueIndex++) {
      comp.click();
      comp.sendKeys(securityArray[secValueIndex]);
      browser.actions().sendKeys(protractor.Key.TAB).perform().then(() => {
        comp.clear();
      });
    }
  }

  private setPercentageValuesForEachSecurity() {
    for (var secPercentValue = 1; secPercentValue < 3; secPercentValue++) {
      var val = element(By.css('body > urebal-app > block-ui > div.drawer-container > div > app-security-model > div.slds-grid.slds-wrap.slds-m-around--medium.box.color-white > div > div.slds-grid.slds-p-around--medium.slds-grid--vertical-stretch > div.slds-col.slds-size--2-of-5 > model-builder > div > div > div.slds-form--stacked.slds-grow.slds-scrollable--y.slds-grid.slds-grid--vertical > div:nth-child(' + secPercentValue + ') > div.slds-form--inline.slds-filter--row'));
      val.element(By.name('security.target')).sendKeys('50');
      val.element(By.name('security.min')).sendKeys('50');
      val.element(By.name('security.max')).sendKeys('50');
    }
  }

  private clickSaveButton() {
    browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    this.getSaveButton().click();
  }

  private getSaveButton() {
    return element(By.partialButtonText('Save'));
  }


  private assertOk() {
    browser.sleep(1000);
    return element(By.css('#saveModelModal > div.slds-modal.add-rebalance-model.modal-saveModelModal.slds-modal--medium.slds-fade-in-open > div > div.slds-modal__footer > button')).click();
  }
}


    //    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    //    browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    // browser.actions().sendKeys(protractor.Key.ENTER).perform()


    //  var el = element(By.xpath('/html/body/urebal-app/block-ui/div[2]/div/app-security-model/div[2]/div/div[2]/div[1]/model-builder/div/div/div[2]/div/div[1]/div[1]/h3'));
    //  el.getText().then(console.log);
    // expect(el.getText()).toContain('A2');

    //  return text;

    //  });


    /* var el=element(by.xpath('/html/body/urebal-app/block-ui/div/app-security-model/div[2]/div/div[2]/div[1]/model-builder/div/div/div[2]/div/h3'));
    var text=function () {
      return el.getText();

    }
     browser.wait(ExpectedConditions.textToBePresentInElement(el,'A2'),6000).then(console.log);
       console.log(text());
       expect(el.getText()).toContain('A2');*/
    /*   ()=>
     {

      /!*onsole.log(el);
       console.log(el.getAttribute('partiallinkText'));
       console.log(el.getAttribute('linkText'));

           return el.getAttribute('linkText');*!///.getText();//.getOuterHtml();
       //.getWebElement().getText();//getText();
     });
     //browser.sleep(3000);
    /!* var elem=element(by.css('body > urebal-app > block-ui > div > app-security-model > div.slds-grid.slds-wrap.slds-m-around--medium.box.color-white > div > div.slds-grid.slds-p-around--medium.slds-grid--vertical-stretch > div.slds-col.slds-size--2-of-5 > model-builder > div > div > div.slds-form--stacked.slds-grow.slds-scrollable--y.slds-grid.slds-grid--vertical > div > h3'));
     browser.wait(ExpectedConditions.textToBePresentInElement(elem,'A2'),5000).then(console.log);*!/

     })*/
    /*  browser.wait(ExpectedConditions.elementToBeClickable(comp),5000).then(()=>
      {
      comp.click();
      comp.sendKeys('A2');//.then(()=>
    //  {
        browser.sleep(3000);
       browser.actions().sendKeys(protractor.Key.ENTER);
       /!* comp .sendKeys(protractor.Key.DOWN);

        comp .sendKeys(protractor.Key.DOWN)
        comp.sendKeys(protractor.Key.ENTER);*!/
        browser.sleep(3000);
       // browser.wait(ExpectedConditions.textToBePresentInElement(element(by.css('body > urebal-app > block-ui > div > app-security-model > div.slds-grid.slds-wrap.slds-m-around--medium.box.color-white > div > div.slds-grid.slds-p-around--medium.slds-grid--vertical-stretch > div.slds-col.slds-size--2-of-5 > model-builder > div > div > div.slds-form--stacked.slds-grow.slds-scrollable--y.slds-grid.slds-grid--vertical > div > h3')),'A2'),5000);
      //})
         /!* comp .sendKeys(Key.ARROW_DOWN);
            comp .sendKeys(Key.ARROW_DOWN)
              comp.sendKeys(Key.ENTER);
              browser.wait(ExpectedConditions.textToBePresentInElement(comp,'A2'),5000);*!/
       /!* browser.driver.manage().timeouts().implicitlyWait(5000);

        browser.driver.manage().timeouts().implicitlyWait(5000);
        comp.sendKeys(Key.ARROW_DOWN);
        browser.driver.manage().timeouts().implicitlyWait(5000);*!/

      })
  /!*
      comp.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
        comp.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
        comp.actions().sendKeys(protractor.Key.ENTER).perform();*!*/




