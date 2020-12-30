import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {URebalService} from "../../../services/urebal.service";

export interface UrebalDropdownMenuLink {
    title: string;
    isAllowed: boolean;
    clickHandler: () => any;
}


@Component({
    selector: 'urebal-dropdown-button',
    templateUrl: './urebal-dropdown-button.component.html',
    styleUrls: ['./urebal-dropdown-button.component.css'],

})
export class UrebalDropdownButtonComponent implements OnInit {

    @Input() title: string;
    @Input() dropdownLinks: UrebalDropdownMenuLink[];

    @Input() splittedButton: boolean = false;

    @Output() onBtnPrimaryClicked = new EventEmitter<any>();

    public isActive: boolean = false;

    constructor(public urebalService: URebalService, private eRef: ElementRef) {
    }

    ngOnInit(): void {
    }

    toggleDropdown() {
        this.isActive = !this.isActive;
    }

    btnPrimaryClicked(event) {
        this.onBtnPrimaryClicked.emit(event);
    }

    onDropDownMenuButtonClicked(dropdownLink: UrebalDropdownMenuLink) {
        this.toggleDropdown();
        dropdownLink.clickHandler();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event) {
        if(!this.eRef.nativeElement.contains(event.target)) {
            this.isActive = false;
        }
    }
}
