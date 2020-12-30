import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent {

  //List of items to be display in autocomplete
  @Input() items: any = [];
  //Event emitter to emit event on click of element
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  selectItem(item) {
    // this.items = [];
    this.onClick.emit(item);
  }
}
