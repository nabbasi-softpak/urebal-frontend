import {Component, EventEmitter, Input, OnInit, Output, ViewChildren} from '@angular/core';
import {ModalComponent} from "../modal/modal.component";
import {DialogModalComponent} from "../dialog-modal/dialog-modal.component";

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css'],
  providers: [{ provide: ModalComponent, useExisting: MessageModalComponent }]
})
export class MessageModalComponent extends ModalComponent {
  @Input() title: string;
  @Input() okText: string = "OK";
  @Input() content: string = "";
  @Output() ok: EventEmitter<any> = new EventEmitter();

  @Input() showHeader: boolean = true;
  @Input() showDivider: boolean = true;
  @Input() showFooter: boolean = true;

  constructor() {
    super();
  }

  okClicked () {
    this.ok.emit();
  }
}

/*
// Usage
<app-message-modal title="ERROR!" (ok)="">
  This is error message
</app-message-modal>
 */
