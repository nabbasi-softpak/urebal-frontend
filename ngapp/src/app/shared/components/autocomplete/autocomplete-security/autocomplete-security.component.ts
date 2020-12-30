import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {SecurityService} from "../../../../security/security.service";
import {DatePipe} from "@angular/common";
import {jqxComboBoxComponent} from "@jqxSource/angular_jqxcombobox";
import {appConfig} from "../../../util/config";
import {SoftpakComboBoxComponent} from "../../../jqwidgets/jqx-combobox/softpak-combobox.component";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-autocomplete-security',
    templateUrl: './autocomplete-security.component.html',
    styleUrls: ['./autocomplete-security.component.css'],
    providers: [DatePipe, jqxComboBoxComponent],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteSecurityComponent implements OnInit {
    @ViewChild('SecurityInputRef', {static: true}) securityInput: SoftpakComboBoxComponent;

    @Input('width') width: string = '100%';
    @Input('attributeType') attributeType: string = null;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    resultLimit = 15;
    sourceData = [];
    requestSubscription: Subscription;

    constructor(public securityService: SecurityService, private datePipe: DatePipe) {
    }

    ngOnInit(): void {
        this.securityInput.width(this.width);
    }

    ngAfterViewInit() {
        this.securityInput.source([]);
        this.securityInput.search(this.securitySearch.bind(this));
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
                request = this.securityService.searchBySecurityID(securityId);
            } else {
                request = this.securityService.searchSecurity(searchString, this.resultLimit);
            }

            $("*").addClass("cursor-progress");

            this.requestSubscription = request.subscribe(this.updateAutocomplete.bind(this, searchString));
        }
    }

    clearSecurityInput() {
        this.securityInput.clearSelection();
        this.securityInput.val("");
        this.securityInput.focus();
        this.securityInput.selectedIndex(-1);
        this.securityInput.close();
    }

    renderer = (index: number, label: string, value: any): string => {
        let datarecord = this.sourceData[index];

        let ticker = datarecord.ticker;
        let securityName = datarecord.securityDescription;
        let securityType = datarecord.securityType || 'N/A';

        let price = "N/A";
        if (datarecord.price) {
            price = appConfig.CURRENCY_SYMBOL + datarecord.price;
        }

        let priceDate = this.datePipe.transform(datarecord.priceDate);
        let pac = datarecord.primaryAssetClass || 'N/A';

        return `<table style="min-width: 150px;">
                        <tr>
                            <td><b>${ticker}</b> - <span class="urebal-word-wrap" title="${securityName}">${securityName}</span></td>
                            <td class="jqx-right-align "><span class="text-color-price">Price: ${price}</span></td>
                        </tr>
                        <tr class="slds-text-color--weak slds-text-body_small">
                            <td class="slds-p-top--xx-small"><span title="PAC: ${pac}">${pac}</span> - <an title="Security Type: ${securityType}">${securityType}</span></td>
                            <td class="slds-p-top--xx-small jqx-right-align slds" style="display: ${priceDate ? 'block' : 'none'}">Price Date: ${priceDate}</td>
                        </tr>
                    </table>`;
    };

    autoCompleteClose(event: any) {
        this.addSecurity();
    }

    addSecurity(security?) {
        if (security == undefined) {
            const selectedItem = this.securityInput.getSelectedItem();
            if (selectedItem) {
                security = selectedItem.originalItem;
            }
        }

        if (security) {
            this.securityInput.animationType('none');

            this.clearSecurityInput();
            this.onSelect.emit(security);

            this.securityInput.animationType('slide');
        }
    }

    updateAutocomplete(searchString, result) {
        $("*").removeClass("cursor-progress");

        if (searchString.trimRight() != searchString) { // Search string contains space
            if (result.length > 0) {
                const security = result[0];
                this.addSecurity(security);
            } else {
                this.clearSecurityInput();
            }
        } else {
            this.sourceData = result;
            this.securityInput.source(result);

            // Note: JqxComboBox focus() method focus element and "select all" value, which is not required. Hence using Vanilla version.
            const securityElement = this.securityInput.host.find('input')[0];
            securityElement.focus();

            this.securityInput.selectedIndex(0);

            // Note: JqxComboBox val() method triggers onSelect if the searchString exactly matches (case-sensitive) the security in the dropdown list. Hence using Vanilla version.
            this.securityInput.host.find('input')[0].value = searchString;
        }
    }
}
