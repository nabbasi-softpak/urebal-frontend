import {Component, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {jqxDropDownListComponent} from '../../../../../src/assets/jqwidgets-ts/angular_jqxdropdownlist';

@Component({
  selector: 'app-urebal-dropdown',
  template: `
    <jqxDropDownList #dropDownListReference [popupZIndex]="99999" [auto-create]='false' [closeDelay]="0" (onChange)='onChangeEvent($event)'
                     (onCheckChange)="onChangeEvent($event)" id="{{id}}"></jqxDropDownList>
  `,
  styles: []
})
export class UrebalDropdownComponent implements OnInit, AfterViewInit {
  @ViewChild('dropDownListReference') dropdownList: jqxDropDownListComponent;
  @Output() onSelect = new EventEmitter<any>();
  @Input() id: string;
  @Input() localdata: any;
  @Input() width: string;
  @Input() selectedIndex: number;
  @Input() checkboxes: boolean = false;
  @Input() displayMember: string;
  @Input() valueMember: string;
  @Input() placeholder: string = "Please Choose:";

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.settings.width = this.width;
    this.settings.source = this.localdata;
    this.settings.checkboxes = this.checkboxes;
    this.settings.displayMember = this.displayMember;
    this.settings.valueMember = this.valueMember;
    this.settings.placeHolder = this.placeholder;

    if (this.selectedIndex != undefined) {
      this.settings.selectedIndex = this.selectedIndex;
    }

    this.dropdownList.createComponent(this.settings);
  }

  refreshDropDown(data?: any) {
    this.dropdownList.source(data);
  }

  disableDropDown(data: boolean) {
    this.dropdownList.disabled(data);
  }

  onChangeEvent(e: any): void {
    let item = e.args.item;
    if (item != null) {
      this.onSelect.emit(item);
    }
  }

  close() {
    this.dropdownList.close();
  }

  isOpen() {
    this.dropdownList.isOpened();
  }

  settings: jqwidgets.DropDownListOptions = {
    height: '30', theme: 'blueleaf', checkboxes: true
  }
}
