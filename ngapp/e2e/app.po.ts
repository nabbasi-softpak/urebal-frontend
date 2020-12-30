import {browser, element, by} from 'protractor';
import {WebElement} from "selenium-webdriver";
import {log} from "util";
import {viewClassName} from "@angular/compiler";
import {ActivatedRoute, Router} from '@angular/router';
import {ReCaptchaComponent} from 'angular2-recaptcha';
import {and} from "@angular/router/src/utils/collection";
import {Observable} from "rxjs/Observable";

  export class URebalPage {
  navigateTo(path = "/") {
    return browser.get('/app/user/login');
  }

  getParagraphText() {
    return element(by.css('.label-secure-login')).getText();
  }


}


// .then(console.log);
//$name1.then(console.log);
//.getAttribute('class');//element(by.className('slds-hide'));
//1);console.log($name
/* browser.driver.manage().timeouts().implicitlyWait(5000);
 if(name) {
   console.log(name.isPresent());
   return name;
 }*/

/*  browser.driver.manage().timeouts().implicitlyWait(6000);
  var captcha1=element(by.id('captchaContainer'));
  console.log(captcha1.getAttribute('class'));
  captcha1.getAttribute('class').then(function (classes) {
    return classes.split('').indexOf('slds-hide')!=-1;
  })*/
/* var wElement: WebElement = element(by.css('body > urebal-app > block-ui > div > urebal-login > div > form > div  > div:nth-child(5)'));
 console.log(wElement.getAttribute(viewClassName.toString()));
var className=wElement.findElements(by.className('slds-hide').toString());
 console.log(className);
 return className;*/

//.findElement(by.tagName('div')[5]);
//var nabia=hidden.getAttribute("class");
//console.log(nabia);



