import {Directive, Output, EventEmitter, Input} from "@angular/core";
import {NgModel} from "@angular/forms";

@Directive({
  selector: '[ngModel][ur-percentage]',
  providers: [NgModel],
  host: {
    "(input)": 'onInputChange($event)',
    "(focusout)": 'onInputBlur($event)'
  }
})
export class PercentageDirective {
  @Output() ngModelChange:EventEmitter<any> = new EventEmitter()
  @Input('percentangeMinRange') minRangeValue: number;
  @Input('ifPercentage') ifPercentage: boolean = false;
  @Input('disablePercentage') disablePercentage: boolean = false;
  @Input('percentVal') percentVal: any;

    onInputChange(event) {

    let value = event.target.value;

    value = this.nonNumberCheck(value);
    value = this.decimalCheck(value);

    if (this.ifPercentage) {
      this.showNotApplicable();
    }

    if(this.disablePercentage == false && value > 100)
    {
      event.target.value = '100';
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
    if (parseFloat(event.target.value) <= this.minRangeValue) {
      event.target.value = this.minRangeValue;
    }
    this.ngModelChange.emit(event.target.value);
    return event.target.value;
  }

  showNotApplicable() {
    if (this.percentVal == null || this.percentVal == 5) {
      return true;
    }
    return false;
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
