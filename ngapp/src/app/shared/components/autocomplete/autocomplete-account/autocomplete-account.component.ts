import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Input, OnChanges,
    OnInit,
    Output, SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {DatePipe} from "@angular/common";
import {jqxComboBoxComponent} from "@jqxSource/angular_jqxcombobox";
import {SoftpakComboBoxComponent} from "../../../jqwidgets/jqx-combobox/softpak-combobox.component";
import {Subscription} from "rxjs";
import {AccountService} from "../../../../account/account.service";

@Component({
    selector: 'app-autocomplete-account',
    templateUrl: './autocomplete-account.component.html',
    styleUrls: ['./autocomplete-account.component.css'],
    providers: [DatePipe, jqxComboBoxComponent],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteAccountComponent implements OnInit {
    @ViewChild('InputRef', {static: true}) input: SoftpakComboBoxComponent;

    @Input('width') width: string = '100%';
    @Input('attributeType') attributeType: string = null;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    resultLimit = 15;
    sourceData = [];
    requestSubscription: Subscription;

    constructor(public accountService: AccountService) {
    }

    ngOnInit(): void {
        this.input.width(this.width);
    }

    ngAfterViewInit() {
        this.input.source([]);
        this.input.search(this.securitySearch.bind(this));
    }

    securitySearch(searchString) {
        // Ref: https://www.jqwidgets.com/community/topic/remote-source-without-jqxdataadapter/
        if (typeof (searchString) == "string") {

            // Unsubscribe if previous request is pending
            if (this.requestSubscription && !this.requestSubscription.closed) {
                this.requestSubscription.unsubscribe();
            }

            const securityId = searchString.trim();
            let request = null;
            if (securityId.length != searchString.length) {
                request = this.accountService.searchByAccountID(securityId);
            } else {
                request = this.accountService.searchAccount(searchString, this.resultLimit);
            }

            $("*").addClass("cursor-progress");

            this.requestSubscription = request.subscribe(this.updateAutocomplete.bind(this, searchString));
        }
    }

    clearInput() {
        this.input.clearSelection();
        this.input.val("");
        this.input.focus();
        this.input.selectedIndex(-1);
        this.input.close();
    }

    renderer = (index: number, label: string, value: any): string => {
        let datarecord = this.sourceData[index];

        let portfolioName = datarecord.portfolioName;
        //let portfolioId = datarecord.portfolioId;
        let taxable = datarecord.taxable;
        let accountNumber = datarecord.accountNumber;
        //let accountId = datarecord.accountId;

        return `<table style="min-width: 150px;">
                        <tr>
                            <td><b>${portfolioName}</b></td>
                            <td class="jqx-right-align "><span class="text-color-price">Taxable: ${taxable}</span></td>

                        </tr>
                        <tr>
                            <td><span class="urebal-word-wrap" title="${accountNumber}">${accountNumber}</td>
                        </tr>
                    </table>`;
    };

    autoCompleteClose(event: any) {
        this.addItem();
    }

    addItem(security?) {
        if (security == undefined) {
            const selectedItem = this.input.getSelectedItem();
            if (selectedItem) {
                security = selectedItem.originalItem;
            }
        }

        if (security) {
            this.input.animationType('none');

            this.clearInput();
            this.onSelect.emit(security);

            this.input.animationType('slide');
        }
    }

    updateAutocomplete(searchString, result) {
        $("*").removeClass("cursor-progress");

        if (searchString.trimRight() != searchString) { // Search string contains space
            if (result.length > 0) {
                const security = result[0];
                this.addItem(security);
            } else {
                this.clearInput();
            }
        } else {
            this.sourceData = result;
            this.input.source(result);

            // Note: JqxComboBox focus() method focus element and "select all" value, which is not required. Hence using Vanilla version.
            const securityElement = this.input.host.find('input')[0];
            securityElement.focus();

            this.input.selectedIndex(0);

            // Note: JqxComboBox val() method triggers onSelect if the searchString exactly matches (case-sensitive) the security in the dropdown list. Hence using Vanilla version.
            this.input.host.find('input')[0].value = searchString;
        }
    }
}
