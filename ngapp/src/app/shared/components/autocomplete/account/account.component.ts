import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  //List of items to be display in autocomplete
  @Input() items: any = [];
  //Event emitter to emit event on click of element
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor(private urebalService: URebalService) { }

  selectItem(item) {
    // this.items = [];
    this.onClick.emit(item);
  }

  parseTaxStatus(taxStatus) {
    if (taxStatus) {
      if (taxStatus == "t" || taxStatus == "1") { // For taxable accounts: taxStatus returned for Postgres is "t" and for Oracle is "1"
        return "yes";
      } else if (taxStatus == "f" || taxStatus == "0") { // For non-taxable accounts: taxStatus returned for Postgres is "f" and for Oracle is "0"
        return "no";
      }
    }

    return "--";
  }
}
