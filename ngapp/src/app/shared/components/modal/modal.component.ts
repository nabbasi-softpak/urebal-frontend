import { Component, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  host: {
    '(document:keydown)' : 'handleEscapeKey($event)'
  }
})
export class ModalComponent implements AfterViewInit{

  @Input() hidden = false;
  @Input() id:string;
  @Input() escKey = true;
  @Input() dataId:any;
  @Input() dataName:any;
  @Output() onViewLoad: EventEmitter<any> = new EventEmitter();
  @Output() onConstructor: EventEmitter<any> = new EventEmitter();
  @Output() postClose: EventEmitter<any> = new EventEmitter();
  @Output() preOpen: EventEmitter<any> = new EventEmitter();
  @Input() modalSize: string = "medium";
  @Input() modalPosition: string = "";
  @Input() containerSize:string="";


  constructor() {
    this.onConstructor.emit();
  }

  ngAfterViewInit(){
    this.onViewLoad.emit();
  }

  open(id=null,name=null) {
    this.dataId = id;
    this.dataName = name;
    this.preOpen.emit();
    this.hidden = true;
    this.modalFunctionality();
  }

  close() {
    this.hidden = false;
    this.modalFunctionality();
    this.postClose.emit();
  }

  modalFunctionality() {
    if (this.hidden) {
      //$('.modal-'+this.id).addClass('slds-fade-in-open');
      $('.modal-'+this.id).addClass('blueleaf-modal-fade-in-open');
      //$('.backdrop-'+this.id).removeClass('slds-backdrop--close');
      $('.backdrop-'+this.id).addClass('blueleaf-backdrop--open');
    } else {
      $('.modal-'+this.id).removeClass('blueleaf-modal-fade-in-open');
      $('.backdrop-'+this.id).removeClass('blueleaf-backdrop--open');
      //$('.backdrop-'+this.id).addClass('slds-backdrop--close');
    }
  }

  handleEscapeKey($event: KeyboardEvent) {
    if($event.key === 'Escape' && this.hidden === true && this.escKey === true) {
      this.close();
    }
  }
}
