import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalComponent} from "../modal/modal.component";

@Component({
    selector: 'app-dialog-modal',
    templateUrl: './dialog-modal.component.html',
    styleUrls: ['./dialog-modal.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{provide: ModalComponent, useExisting: DialogModalComponent}]
})
export class DialogModalComponent extends ModalComponent {
    @Input() title: string;
    @Input() yesText: string = "Yes";
    @Input() hideSecondaryButton: boolean = false;
    @Input() noText: string = "No";
    @Input() content: string = "";
    @Output() yes: EventEmitter<any> = new EventEmitter();
    @Output() no: EventEmitter<any> = new EventEmitter();

    @Input() showHeader: boolean = true;
    @Input() showDivider: boolean = true;
    @Input() showFooter: boolean = true;

    constructor(private ref: ChangeDetectorRef) {
        super();
    }

    open() {
        this.ref.detectChanges();
        super.open()
        $('.slds-button').focus();
    }

    yesClicked() {
        this.yes.emit();
    }

    noClicked() {
        this.no.emit();
    }
}

/*
// Usage
<app-dialog-modal title="Delete Model" (yes)="" (no)="">
  Do you really want to delete 102 records?
</app-dialog-modal>
 */
