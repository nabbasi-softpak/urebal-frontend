import {Directive, Output, EventEmitter} from "@angular/core";
import {NgModel} from "@angular/forms";

@Directive({
  selector: "[ngModel][ur-number-format]",
  providers: [NgModel],
  host: {
    "(input)": 'onInputChange($event)'
  }
})
export class NumberFormatterDirective {
  @Output() ngModelChange:EventEmitter<any> = new EventEmitter()

   onInputChange(event) {

    let value = event.target.value;

    value = this.nonNumberCheck(value);
    value = this.decimalCheck(value);

    event.target.value = value;
    this.ngModelChange.emit(event.target.value);
    return;
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
