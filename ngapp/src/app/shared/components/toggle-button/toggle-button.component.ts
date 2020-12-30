import {Component, Input, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.css']
})
export class ToggleButtonComponent {

  @Input() buttonProperty:string;
  @Input() buttonValue:boolean;
  @Input() labelTrue: string = "Don't Sell";
  @Input() labelFalse: string = "Sell";
  @Input() disableBtn: boolean = false;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  changeState(event) {
    if(!$(event.currentTarget).hasClass('slds-button-active'))
    {
      $('.toggle-'+this.buttonProperty+' > button').removeClass('slds-button-active');
      $(event.currentTarget).addClass('slds-button-active');
      this.buttonValue = !this.buttonValue;
    }

    this.onChange.emit();
  }
}
