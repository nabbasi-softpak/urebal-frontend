import {Component, OnInit, ViewChild} from '@angular/core';
import { WorkspaceService } from '../../../workspaces/workspace.service';
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {AccountService} from "../../../account/account.service";
import {AutocompleteComponent} from "../../../shared/components/autocomplete/autocomplete.component";
import {AccountSummaryComponent} from "../../../shared/components/account-summary/account-summary.component";


@Component({
  selector: 'app-sharelot-report',
  templateUrl: './sharelot-report.component.html'
})
export class SharelotReportComponent implements OnInit {

  @ViewChild('sharelotReportGrid') sharelotReportGrid: UrebalGridComponent;
  @ViewChild(AutocompleteComponent) autoComplete:AutocompleteComponent;
  @ViewChild(AccountSummaryComponent) accountSummary: AccountSummaryComponent;


  public portfolioList = [];
  public portfolio = {};
  public errMsg = '';
  public disableBtns = true;
  private sharelotReport: any;

  constructor(public workspaceService : WorkspaceService, public accountService: AccountService) { }

  ngOnInit() {

    this.accountService.getPortfoliosList().subscribe(result => {
      this.portfolioList = result.responsedata;
    });

  }

  getReport(portfolio) {

    this.accountSummary.loadSummary(portfolio.portfolioId);
    $('#printData').removeClass('slds-hide');
    this.portfolio = portfolio;

    this.accountService.get("portfolios/"+portfolio.portfolioId+"/reports/sharelot?sort=accountId:asc,ticker:asc,shareLotId:asc").subscribe(result=> {
      if(result.code == 200) {
        this.sharelotReport = result.responsedata;
        this.errMsg = '';
        this.disableBtns = false;
      }else{
        this.sharelotReport = [];
        this.errMsg = result.message;
        this.disableBtns = true;
      }

      this.sharelotReportGrid.refreshGrid(this.sharelotReport);
      this.sharelotReportGrid.jqxGrid.showemptyrow(true);
    });

  }

  printme() {
    this.disableBtns = true;
    let rows = Object.assign([],this.sharelotReportGrid.getRows());

    for(let count=0; count<rows.length; count++) {

      if(rows[count].roundGainLossValue < 0)
      {
        // invalid date
        let customValue = '('+rows[count].roundGainLossValue.toFixed(2)+')';
        rows[count].roundGainLossValue = customValue.replace('-','$');
      }
      // rows[count].purchaseDate = (rows[count].purchaseDate === null) ? 'N/A' : rows[count].purchaseDate;
    }

    let gridContent = this.sharelotReportGrid.jqxGrid.host.jqxGrid('exportdata', 'html', null);

    let newWindow = window.open('', '', 'width=800, height=500'),
      document = newWindow.document.open(),
      pageContent =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '<meta charset="utf-8" />\n' +
        '<style>\n' +
        '.slds-size--1-of-1 {width: 100%;}\n'+
        '.slds-align--absolute-center {display: -ms-flexbox;display: flex;-ms-flex-pack: center;justify-content: center;-ms-flex-line-pack: center;align-content: center;-ms-flex-align: center;align-items: center;margin: auto; }\n' +
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
        '<body>\n' + '<div><h1 style="text-align: center">'+$('.slds-page-header__title').html()+ '</h1></div>' + $('#printSummary').html() + gridContent + '\n</body>\n</html>';

    setTimeout(() => {
      try {
        document.write(pageContent);
        document.close();
        newWindow.print();
        newWindow.close();
        this.sharelotReportGrid.refreshGrid();
        this.disableBtns = false;
      }
      catch (error) {
        console.log(error)
      }
    },100);
  }

  exportme() {

    let rows = Object.assign([],this.sharelotReportGrid.getRows());

    for(let count=0; count<rows.length; count++) {

      if(rows[count].roundGainLossValue < 0)
      {
        // invalid date
        let customValue = '('+rows[count].roundGainLossValue.toFixed(2)+')';
        rows[count].roundGainLossValue = customValue.replace('-','$');
      }
      // rows[count].purchaseDate = (rows[count].purchaseDate === null) ? 'N/A' : rows[count].purchaseDate;
    }

    let gridCSV = this.sharelotReportGrid.jqxGrid.host.jqxGrid('exportdata', 'csv', null);

    let blob = new Blob([this.generateCSV(gridCSV)], {type: 'text/plain'});
    saveAs(blob,'Sharelot-Summary.csv');
    this.sharelotReportGrid.refreshGrid();
  }

  generateCSV(gridCSV) {
    let accountSummary = this.accountSummary.generateCSV();

    return accountSummary +"\n\n"+ gridCSV;
  }
}
