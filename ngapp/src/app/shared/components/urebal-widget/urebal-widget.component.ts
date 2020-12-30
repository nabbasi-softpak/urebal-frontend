import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'urebal-widget',
  templateUrl: './urebal-widget.component.html',
  styleUrls: ['./urebal-widget.component.css']
})
export class UrebalWidgetComponent implements OnInit {

  @Input() showHeader: boolean = true;
  @Input() showDivider: boolean = true;
  @Input() showFooter: boolean = false;
  @Input() contentClass: string = '';

  constructor() { }

  ngOnInit() {
  }

}
