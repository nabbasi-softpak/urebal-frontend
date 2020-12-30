import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[focus-next-input]',
  host: {
    "(keydown)": 'onEnterKey($event)',

  }
})
export class NextInputDirective {


  constructor() { }

  onEnterKey(event) {
    if (event.code == 'Enter') {
      let element = event.currentTarget.offsetParent.nextElementSibling;
      let nextInput = element.getElementsByTagName('input')[0];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

}
