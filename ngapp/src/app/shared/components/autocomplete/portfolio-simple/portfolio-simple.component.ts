import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-portfolio-simple',
  templateUrl: './portfolio-simple.component.html',
  styleUrls: ['./portfolio-simple.component.css']
})
export class PortfolioSimpleComponent implements OnInit {


  //List of items to be display in autocomplete
  @Input() items: any = [];
  //Event emitter to emit event on click of element
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor(private urebalService: URebalService) { }

  ngOnInit() {
  }


  selectItem(item) {
    // this.items = [];
    this.onClick.emit(item);
  }

}
