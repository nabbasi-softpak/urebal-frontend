import { Directive, Output, EventEmitter, Input } from '@angular/core';
import {NgModel} from "@angular/forms";

@Directive({
  selector: '[ngModel][ur-NumberOfDays]',
  providers: [NgModel],
  host: {
    "(input)": 'onInputChange($event)',
    "(focusout)": 'onInputBlur($event)'
  }
})
export class NumberOfDaysDirective {

  @Output() ngModelChange:EventEmitter<any> = new EventEmitter()
  @Input('daysMinRange') minRangeValue: number;

  onInputChange(event) {

    let value = event.target.value;

    value = this.nonNumberCheck(value);
    value = this.decimalCheck(value);

    if(value > 366)
    {
      event.target.value = '366';
      this.ngModelChange.emit(event.target.value);
      return;
    }
    else if (value == '') {
      event.target.value = 0;
      this.ngModelChange.emit(event.target.value);
      return;
    }
    else
    {
      event.target.value = value;
      this.ngModelChange.emit(event.target.value);
      return;
    }
  }

  onInputBlur(event) {
    if (event.target.value <= this.minRangeValue) {
      event.target.value = this.minRangeValue;
    }
    this.ngModelChange.emit(event.target.value);
    return event.target.value;
  }



  private nonNumberCheck(value) : string
  {
    return value.replace(/[^0-9.]/g, '');
  }

  private decimalCheck(value) : string
  {
    let decimalCheck = value.split('.');

    if (decimalCheck[1] != undefined) {
      decimalCheck[1] = decimalCheck[1].slice(0, 4);
      value = decimalCheck[0] + '.' + decimalCheck[1];
    }
    return value;
  }

}
