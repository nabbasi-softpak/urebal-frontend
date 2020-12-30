import {Directive, Output, EventEmitter} from "@angular/core";
import {NgModel} from "@angular/forms";

@Directive({
  selector: '[ngModel][uppercase]',
  providers: [NgModel],
  host: {
    "(input)": 'onInputChange($event)'
  }
})
export class UpperCaseDirective {

  @Output() ngModelChange:EventEmitter<any> = new EventEmitter()
  value: any

  onInputChange($event){
    this.value = $event.target.value.toUpperCase()
    this.ngModelChange.emit(this.value)
  }
}
