import {Component, EventEmitter, Output, Input} from '@angular/core';
import {trigger, state, transition, style, animate, } from '@angular/animations';


@Component({
  selector: 'app-expandable-settings',
  templateUrl: './expandable-settings.component.html',
  styleUrls: ['./expandable-settings.component.css'],
  animations: [
    trigger('toggleState', [

      state('false', style({
         opacity: 1, top: '-5px' ,padding: 0, display: 'block'
      })),
      state('true',   style({
          opacity: 0, padding: 0 , display: 'none'

      })),

     transition('true => false', animate('1000ms ease-in')),
     transition('false => true', animate('1000ms ease-in')),
    ])
  ]

})
export class ExpandableSettingsComponent  {

  public hidden : string = 'true';
  @Input() getElementID;
  @Output() postOpen : EventEmitter<any> = new EventEmitter();

  private elementid: any;
  private elementOriginalHeight: any;


  animateSlider(height, timeOut) {
    this.elementid = document.getElementById(this.getElementID);
    this.elementid.style.height = this.elementid.clientHeight + 'px';
    this.elementOriginalHeight = this.elementid.style.height;
    setTimeout(() => {
      this.elementid.style.height = height;
    }, timeOut);
  }

  openSettingsDrawer(callback =()=>{}) {
     this.postOpen.emit();
     this.animateSlider('0px', 200);
     this.hidden = 'false';
    callback();
  }

  closeSettingsDrawer() {
    this.animateSlider(this.elementOriginalHeight, 100);
    this.hidden = 'true';
  }


}
