import {AfterViewInit, Component, ViewChild} from '@angular/core';

import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";
import {ReportsService} from "../reports.service";
import {AutocompleteComponent} from "../../shared/components/autocomplete/autocomplete.component";
import {saveAs} from 'file-saver';
import {UILoader} from '../../shared/util/UILoader';


@Component({
    selector: 'app-who-owns',
    templateUrl: './who-owns.component.html',
    styleUrls: ['./who-owns.component.css']
})
export class WhoOwnsComponent implements AfterViewInit {

    public reportsArr = [];
    public tickerArr = [];
    public selectedTicker: string;
    public MktPrice = 0;
    public totalShares = 0;
    public totalMktValue = 0;
    public totalAccounts = 0;
    public errMsg: string = '';
    public disableBtns: boolean = true;
    @ViewChild('whoOwnsGrid') whoOwnsGrid: UrebalGridComponent;
    @ViewChild(AutocompleteComponent) autoComplete: AutocompleteComponent;

    constructor(public service: ReportsService) {
    }

    ngAfterViewInit() {
        this.service.getPriceList().subscribe(response => {
            if (response.code == 200) {
                this.tickerArr = response.responsedata;
            }
        });


    }

    printme() {

        this.disableBtns = true;
        let rows = Object.assign([], this.whoOwnsGrid.getRows());

        for (let count = 0; count < rows.length; count++) {

            if (rows[count].unrealizedGainLoss < 0) {
                // invalid date
                let customValue = '(' + rows[count].unrealizedGainLoss.toFixed(0).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + ')';
                rows[count].unrealizedGainLoss = customValue.replace('-', '$');
            }
        }

        let gridContent = this.whoOwnsGrid.jqxGrid.host.jqxGrid('exportdata', 'html', null);

        let newWindow = window.open('', '', 'top=0,left=0'),
            document = newWindow.document.open(),
            pageContent =
                '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '<meta charset="utf-8" />\n' +
                '<style>\n' +
                '*, *:before, *:after { box-sizing: border-box; }\n' +
                '.gridContainer{ width: 100%; }\n' +
                '.slds-truncate {    max-width: 100%;    overflow: hidden;    text-overflow: ellipsis;    white-space: nowrap; }\n' +
                '.slds-p-around--medium {padding: 1rem; }\n' +
                '.slds-container_center{margin-left:auto;margin-right:auto}\n' +
                '.slds-size--1-of-3 {width: 33.3333333333%; }\n' +
                '.slds-tile + .slds-tile { margin-top: 0.5rem; }\n' +
                '.slds-section-title {font-size: 1rem; }\n' +
                '.slds-section-title > a {display: inline-block;color: #16325c; }\n' +
                '.slds-section-title .slds-icon {  width: 1rem;  height: 1rem;  fill: currentColor; }\n' +
                '.slds-section-title .slds-section-group_is-closed .slds-icon,.slds-section-title .slds-section-group--is-closed .slds-icon {  transform: rotate(-90deg); }\n' +
                '.slds-tile__detail {position: relative; }\n' +
                '.slds-text-body--small {font-size: 0.75rem; }\n' +
                '.slds-list--horizontal { display: -ms-flexbox;display: flex; }\n' +
                '.slds-list--horizontal .slds-item--label {width: 50%;padding-right: 0.75rem; }\n' +
                '.slds-list--horizontal .slds-item--detail {width: 50%; }\n' +
                '.slds-wrap {-ms-flex-wrap: wrap;flex-wrap: wrap;-ms-flex-align: start;align-items: flex-start; }\n' +
                '.slds-grid {display: -ms-flexbox;display: flex; }\n' +
                '.slds-text-color--weak {color: #54698d; }\n' +
                '.text-color-grey--c4c6c7{color:#c4c6c7;fill:#c4c6c7;  }\n' +
                '.text-color-price{color:#4caf50;fill:#4caf50;}\n' +
                'table{width: 97%;margin-left:7px}\n' +
                'dd { margin: 0px; }\n' +
                '</style>\n' +
                '</head>\n' +
                '<body>\n' + '<div style="text-align:center;"><h1>' + $('.slds-page-header__title').html() + '</h1></div>' + $('#printSummary').html() + gridContent + '\n</body>\n</html>';

        setTimeout(() => {
            try {
                document.write(pageContent);
                document.close();
                newWindow.print();
                newWindow.close();
                this.disableBtns = false;
                this.whoOwnsGrid.refreshGrid();
            } catch (error) {
                console.log(error)
            }
        }, 100);

    }

    selectedItem(security) {
        UILoader.blockUI.start();
        $('#printData').removeClass('slds-hide');

        this.selectedTicker = security.securityId;
        this.MktPrice = security.price;

        this.service.getTickerReport(this.selectedTicker).subscribe(
            data => {
                if (data.code == 200) {
                    this.whoOwnsGrid.refreshGrid(data.responsedata);
                } else {
                    this.whoOwnsGrid.refreshGrid([]);
                }
            });

        UILoader.blockUI.stop();
    }

    createAccountSummary(event) {
        this.totalShares = 0;
        this.totalMktValue = 0;
        this.totalAccounts = 0;

        if (event.args.owner.source.totalrecords > 0) {
            this.errMsg = '';
            this.disableBtns = false;

            for (let i = 0; i < event.args.owner.source.totalrecords; i++) {
                this.totalShares = this.totalShares + event.args.owner.source.records[i].shares;
                this.totalMktValue = this.totalMktValue + event.args.owner.source.records[i].marketValue;
            }
            this.totalAccounts = event.args.owner.source.totalrecords;
            this.totalMktValue = Math.round(this.totalMktValue);
        } else {
            this.totalShares = 0;
            this.totalMktValue = 0;
            this.totalAccounts = 0;
            this.reportsArr = [];
            this.errMsg = this.whoOwnsGrid.serviceErrorMessage;
            this.disableBtns = true;
        }
    }

    downloadReport() {
        let csv = this.selectedTicker + '\n' +
            '"Market Price","$' + this.MktPrice + '"\n' +
            '"Total Accounts","' + this.reportsArr.length + '"\n' +
            '"Total Shares","' + this.totalShares.toLocaleString('en') + '"\n' +
            '"Total Market Value","$' + this.totalMktValue + '"\n' +
            '\n\n' + this.whoOwnsGrid.jqxGrid.host.jqxGrid('exportdata', 'csv', null);

        let blob = new Blob([csv], {type: 'application/csv'});
        saveAs(blob, this.selectedTicker + ".csv");
        this.whoOwnsGrid.refreshGrid();

    }
}
