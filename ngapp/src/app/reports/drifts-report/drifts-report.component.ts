import {Component, OnInit, ViewChild} from '@angular/core';
import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";
import {Router} from "@angular/router";
import {DriftService} from "../../drifts/drift.service";
import {DriftStatus} from "../../account/account.service";
import {AppConfig} from "../../../app.config";


@Component({
  selector: 'app-drifts-report',
  templateUrl: './drifts-report.component.html',
  styleUrls: ['./drifts-report.component.css']
})
export class DriftsReportComponent implements OnInit {

  public drifts = [];
  public driftedAccounts = [];
  public totalAccounts = 0;
  public disableBtns: boolean = false;
  public driftDate='';
  public DATETIME_FORMAT = AppConfig.DATETIME_FORMAT;

  @ViewChild(UrebalGridComponent) driftsGrid: UrebalGridComponent;
  constructor(private router: Router, public driftService: DriftService) { }

  ngOnInit() {
    // false means apply no filter
    this.driftService.getDriftsList(false).subscribe((response) => {
      if (response.code == 200) {
        this.drifts = response.responsedata.items;
        this.driftsGrid.refreshGrid(this.drifts);

        // this.driftedAccounts = [];
        for (let i=0; i<this.drifts.length; i++) {
          if(i == 0) this.driftDate = this.drifts[i].asOfDate;
          if (this.drifts[i].driftStatus == DriftStatus.STATUS_OUT_OF_TOLERANCE_AND_CASH_IN || this.drifts[i].driftStatus == DriftStatus.STATUS_OUT_OF_TOLERANCE|| this.drifts[i].driftStatus == DriftStatus.STATUS_CASH_IN
            || this.drifts[i].driftStatus == DriftStatus.STATUS_ERROR || this.drifts[i].driftStatus == DriftStatus.STATUS_UNASSINGED )
          {
            this.driftedAccounts.push(this.drifts[i]);
          }
        }
      }
    });

    this.driftService.get('PortfolioWS/getPortfolioCount').subscribe((response) => {
      if(response.code == 200) {
        this.totalAccounts = response.responsedata;
      }
    });
  }

  ngAfterViewInit()
  {
  }


  printReport(){
    this.disableBtns = true;


    let gridContent = this.driftsGrid.jqxGrid.host.jqxGrid('exportdata', 'html', null);

    let newWindow = window.open('', '', 'top=0,left=0'),
      document = newWindow.document.open(),
      pageContent =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '<meta charset="utf-8" />\n' +
        '<style>\n' +
        '.slds-size--1-of-1 {width: 100%;}\n'+
        '.slds-align--absolute-center {display: -ms-flexbox;display: flex;-ms-flex-pack: center;justify-content: center;-ms-flex-line-pack: center;align-content: center;-ms-flex-align: center;align-items: center;margin: auto; }</script>\n' +
        '.color-white{background:#fff;}\n'+
        '.slds-grid {display: -ms-flexbox;display: flex; }\n'+
        '.slds-wrap {-ms-flex-wrap: wrap;flex-wrap: wrap;-ms-flex-align: start;align-items: flex-start; }\n'+
        '.slds-col,[class*="slds-col_padded"],[class*="slds-col--padded"] {-ms-flex: 1 1 auto;flex: 1 1 auto; }\n'+
        '.slds-size_1-of-2,.slds-size--1-of-2 {width: 50%; }\n'+
        '.slds-p-around_medium,.slds-p-around--medium {padding: 1rem; }\n'+
        '.text-color-grey--c4c6c7{color:#c4c6c7;fill:#c4c6c7;  }\n'+
        '.slds-size_2-of-2,.slds-size--2-of-2 {width: 100%;}\n'+
        '.slds-size_1-of-3,.slds-size--1-of-3 {width: 33.3333333333%; }\n'+
        '.slds-border_top,.slds-border--top {border-top: 1px solid #d8dde6; }\n'+
        '.text-color-price{color:#4caf50;fill:#4caf50;}\n'+
        'table{width: 97%;margin-left:7px}\n'+
        '</style>\n' +
        '</head>\n' +
        '<body>\n' + '<div><h1 style="text-align: center">'+$('.slds-page-header__title').html()+'</h1></div>' + $('#printSummary').html() + gridContent + '\n</body>\n</html>';

    setTimeout(() => {
      try {
        document.write(pageContent);
        document.close();
        newWindow.print();
        newWindow.close();
        this.disableBtns = false;
        this.driftsGrid.refreshGrid();
      }
      catch (error) {
        console.log(error)
      }
    },100);
  }

  downloadReport() {
    let csv =
      '"Number of Accounts:",' + this.drifts.length + ',' + ',,,' + '"Total Accounts Drifted:",' + this.driftedAccounts.length +
      '\n\n' +
      this.driftsGrid.jqxGrid.host.jqxGrid('exportdata', 'csv', null);
    let blob = new Blob([csv], {type: 'application/csv'});
    saveAs(blob,'Drifts-Report.csv');
    this.driftsGrid.refreshGrid();
  }
}
