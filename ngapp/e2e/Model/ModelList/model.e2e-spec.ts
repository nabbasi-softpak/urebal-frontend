import {ModelPage} from "./model.po"
import {browser, By, element, ExpectedConditions} from "protractor";


describe('Model page navigation', function () {
  let modelList: ModelPage;
  beforeAll(() => {
    modelList = new ModelPage();
  });
  it('Navigate to model list by URL', () => {
     browser.waitForAngularEnabled(false);
     modelList.navigateToModelList();
     expect(browser.getCurrentUrl()).toContain('model/list');
   })

  //NOTE: AAM model verification and edit comment out because of changing positions of attributes while edit.


  /* it('Model list verification of AAM model', () => {
     modelList.searchModel('NW_ATTR_MODEL01');
     var details = modelList.getModelRow();
     browser.waitForAngular();
     expect(details.get(1).getAttribute('title')).toEqual('14000');
     expect(details.get(2).getAttribute('title')).toEqual('NW_ATTR_MODEL01');
     expect(details.get(3).getAttribute('title')).toEqual('Asset Allocation Model');
     expect(details.get(4).getAttribute('title')).toEqual('6');
     expect(details.get(5).getAttribute('title')).toEqual('3');
     expect(details.get(6).getAttribute('title')).toEqual('40.00');
     expect(details.get(7).getAttribute('title')).toEqual('0');
   });
   it('Verify attribute names and cash attribute details', () => {
     var model = modelList.getModelRow().get(2).element(By.tagName('a'));
     model.click().then(() => {
            expect(modelList.verifyModelName().getText()).toEqual('NW_ATTR_MODEL01');
       for (var j = 0; j < 3; j++) {
         var val = modelList.verifyAttributes(j);
         val.getText().then(console.log);
         expect('Financial | 30%\n' +
           'CASH ATTRIBUTE | 40%\n' + 'Basic Materials | 30%').toContain(val.getText());
       }
     })
   });
   it('Verify security details present in AAM model', () => {
     for (var m = 0; m < 3; m++) {
       var verify = modelList.verifySubmodels(m);
       if (m == 0) {
         expect(verify.getText()).toContain('ENFC\n' +
           'Entegra Financial Corp.\n' +
           '--\n' +
           '--\n' +
           'Financial\n' +
           '50.00\n' +
           '50.00\n' +
           '50.00\n' +
           'WSBF\n' +
           'Waterstone Financial, Inc.\n' +
           '--\n' +
           '--\n' +
           'Financial\n' +
           '50.00\n' +
           '50.00\n' +
           '50.00\n');




       }
       else if (m == 1) {
         expect(verify.getText()).toContain(
           'AGYCX\n' +
           'American Century Global Gold C\n' +
           'Medium\n' +
           'Blend\n' +
           'Basic Materials\n' +
           '25.00\n' +
           '25.00\n' +
           '25.00\n' +
           'BGEIX\n' +
           'American Century Global Gold Inv\n' +
           'Medium\n' +
           'Blend\n' +
           'Basic Materials\n' +
           '25.00\n' +
           '25.00\n' +
           '25.00\n' +
           'RING\n' +
           'iShares MSCI Global Gold Miners ETF\n' +
           'Medium\n' +
           'Blend\n' +
           'Basic Materials\n' +
           '50.00\n' +
           '50.00\n' +
           '50.00\n');

       }
       else  {
         expect(verify.getText()).toContain('$CASH\n' +
           '$CASH\n' +
           '--\n' +
           '--\n' +
           '--\n' +
           '100.00\n' +
           '100.00\n' +
           '100.00\n');

       }
     }
   });

   it('verify chart view appearance', () => {
     var button = modelList.verifyChart();
     button.click();
     var ver = modelList.verifySubmodels(0);
     expect(ver.isDisplayed()).toBeFalsy();
     expect(modelList.chartAppear()).toContain('Basic Materials\n'+'CASH ATTRIBUTE\n'+'Financial');
   });
   it('Verify stack view', () => {

     modelList.verifyButton();
     var verify = modelList.verifySubmodels(0);
     expect(verify.isDisplayed()).toBeTruthy();//toEqual('Flattened Model');
   });

   it('Verify flattened model', () => {
     browser.sleep(1000);
     var flattened = modelList.verifyFlattened();
     flattened.click();

     for (var m = 0; m < 3; m++) {
       var verify = modelList.verifySubmodels(m);


       if (m ==0) {
         expect(verify.getText()).toContain('ENFC\n' +
           'Entegra Financial Corp.\n' +
           '--\n' +
           '--\n' +
           'Financial\n' +
           '15.00\n' +
           '15.00\n' +
           '15.00\n' +
           'WSBF\n' +
           'Waterstone Financial, Inc.\n' +
           '--\n' +
           '--\n' +
           'Financial\n' +
           '15.00\n' +
           '15.00\n' +
           '15.00\n');



       }
       else if (m == 1) {
         expect(verify.getText()).toContain(
           'AGYCX\n' +
           'American Century Global Gold C\n' +
           'Medium\n' +
           'Blend\n' +
           'Basic Materials\n' +
           '7.50\n' +
           '7.50\n' +
           '7.50\n' +
           'BGEIX\n' +
           'American Century Global Gold Inv\n' +
           'Medium\n' +
           'Blend\n' +
           'Basic Materials\n' +
           '7.50\n' +
           '7.50\n' +
           '7.50\n' +
           'RING\n' +
           'iShares MSCI Global Gold Miners ETF\n' +
           'Medium\n' +
           'Blend\n' +
           'Basic Materials\n' +
           '15.00\n' +
           '15.00\n' +
           '15.00\n');

         }
         else  {
         expect(verify.getText()).toContain('$CASH\n' +
           '$CASH\n' +
           '--\n' +
           '--\n' +
           '--\n' +
           '40.00\n' +
           '40.00\n' +
           '40.00\n');


       }
     }
   });


  it('Verify edit model details', () => {
    var [heading, model, attrtype] = modelList.verifyEditScreen();
    expect(heading.getText()).toEqual('NW_ATTR_MODEL01');
    expect(model.getAttribute('ng-reflect-model')).toEqual('NW_ATTR_MODEL01');
    expect(attrtype.getText()).toEqual('Sector');
browser.sleep(1000);
    for (var j = 0; j < 3; j++) {


      var [name, per] = modelList.verifyPercentages(j);
      browser.waitForAngular();
      name.getText().then(console.log);
      per.getAttribute('ng-reflect-model').then(console.log);
      expect('CASH ATTRIBUTE' + 'Basic Materials' + 'Financial').toContain(name.getText());
      expect('40' + '30' + '30').toContain(per.getAttribute('ng-reflect-model'));

    }
  })


  it("Verify sub-models and their details", () => {
    var [e1, i, e2, e3, e4, e5, e6, e7] = modelList.verifySecurity(5);
    if (i = 0) {
      expect(e1.getText()).toContain('AGYCX\n' + '-\n' + 'American Century Global Gold C');
      expect(e2).toEqual('25');
      expect(e3).toEqual('25');
      expect(e4).toEqual('25');
      expect(e5).toEqual('7.500');
      expect(e6).toEqual('7.500');
      expect(e7).toEqual('7.500');
    }
    else if (i = 1) {
      expect(e1.getText()).toEqual('BGEIX\n' + '-\n' + 'American Century Global Gold Inv');//\n' + 'Medium Blend Basic Materials
      expect(e2).toEqual('25');
      expect(e3).toEqual('25');
      expect(e4).toEqual('25');
      expect(e5).toEqual('7.500');
      expect(e6).toEqual('7.500');
      expect(e7).toEqual('7.500');
    }
    else if (i = 2) {
      expect(e1.getText()).toEqual('RING\n' + '-\n'  + 'iShares MSCI Global Gold Miners ETF');//\n' + 'Medium Blend Basic Materials
      expect(e2).toEqual('50');
      expect(e3).toEqual('50');
      expect(e4).toEqual('50');
      expect(e5).toEqual('15.000');
      expect(e6).toEqual('15.000');
      expect(e7).toEqual('15.000');
    }

    else if (i = 3) {
      expect(e1.getText()).toEqual('ENFC\n' + '-\n'  + 'Entegra Financial Corp.');//\n' + 'Financial
      expect(e2).toEqual('50');
      expect(e3).toEqual('50');
      expect(e4).toEqual('50');
      expect(e5).toEqual('15.000');
      expect(e6).toEqual('15.000');
      expect(e7).toEqual('15.000');
    }

    else {
      expect(e1.getText()).toEqual('WSBF\n' + '-\n'  + 'Waterstone Financial, Inc');//\n' + 'Financial
      expect(e2).toEqual('50');
      expect(e3).toEqual('50');
      expect(e4).toEqual('50');
      expect(e5).toEqual('15.000');
      expect(e6).toEqual('15.000');
      expect(e7).toEqual('15.000');
    }

  })

  it('Verify editing the securities ', () => {
    browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
    modelList.addSec('EPGFX');
    modelList.setSec('RING',25);
    modelList.setSec('EPGFX',25);
    browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
    modelList.save().then(()=>{
      browser.sleep(1000);
      it('Re-Navigate to model list by URL', () => {
        browser.waitForAngularEnabled(false);
        modelList.navigateToModelList();
        expect(browser.getCurrentUrl()).toContain('model/list');
      })
      it('Model list verification of AAM model after adding security', () => {
        modelList.searchModel('NW_ATTR_MODEL01');
        var details = modelList.getModelRow();
        browser.waitForAngular();
        expect(details.get(1).getAttribute('title')).toEqual('14000');
        expect(details.get(2).getAttribute('title')).toEqual('NW_ATTR_MODEL01');
        expect(details.get(3).getAttribute('title')).toEqual('Asset Allocation Model');
        expect(details.get(4).getAttribute('title')).toEqual('7');
        expect(details.get(5).getAttribute('title')).toEqual('3');
        expect(details.get(6).getAttribute('title')).toEqual('40.00');
        expect(details.get(7).getAttribute('title')).toEqual('0');
      });
    })

  })*/

  })























