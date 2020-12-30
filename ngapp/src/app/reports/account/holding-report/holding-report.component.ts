import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {WorkspaceService} from "../../../workspaces/workspace.service";
import {AccountService} from "../../../account/account.service";
import {AutocompleteComponent} from "../../../shared/components/autocomplete/autocomplete.component";
import {AccountSummaryComponent} from "../../../shared/components/account-summary/account-summary.component";
import {jqxTreeGridComponent} from "../../../../../src/assets/jqwidgets-ts/angular_jqxtreegrid";
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-holding-report',
  templateUrl: './holding-report.component.html'
})
export class HoldingReportComponent implements OnInit, AfterViewInit {

  @ViewChild('holdingsReportGrid') holdingsReportGrid: jqxTreeGridComponent;
  @ViewChild(AutocompleteComponent) autoComplete:AutocompleteComponent;
  @ViewChild(AccountSummaryComponent) accountSummary:AccountSummaryComponent;

  public accountList = [];
  public portfolioList = [];
  public account = {};
  public portfolio;
  public positions = [];
  public position = {ticker:'',children: []};
  public errMsg = '';
  public disableBtns = true;

  constructor(
    public workspaceService: WorkspaceService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {

    this.accountService.getPortfoliosList().subscribe(result => {
      this.portfolioList = result.responsedata;
    });

  }

  getAccounts(portfolio) {
    $('#printData').removeClass('slds-hide');
    this.portfolio = portfolio;
    this.accountList = [];
    if(portfolio.accounts.length > 1) {
      $('#sleeveCombo').removeAttr('disabled');
      this.accountList = portfolio.accounts;
      $("#sleeveCombo").val(portfolio.accounts[0].accountName);
      this.getReport(portfolio.accounts[0].accountId)
    } else {
      $('#sleeveCombo').attr('disabled', 'disabled');
      this.getReport(portfolio.accounts[0])
    }
  }

  ngAfterViewInit () {
    this.holdingsReportGrid.createComponent(this.treeGridSettings);
  }

  source =
    {
      dataType: "json",
      dataFields: [
        {"name":"ticker","type":"string"},
        {"name":"shares","type":"number"},
        {"name":"shareLots","type":"number"},
        {"name": "isTradeable", "type": "boolean"},
        {"name": "basisPrice", "type": "number"},
        {"name": "marketValue", "type": "number"},
        {"name": "buyDate", "type": "date"},
        {"name": "children", "type": "array"}
      ],
      hierarchy:
        {
          root: 'children'
        },
      id: 'ticker',
      url: null,
      localdata: null
    };

  cellClass(row, dataField, cellText, rowData): string {
    if(typeof rowData.children !== 'undefined'){
      return 'grid-row-class parent-row-class';
    }
  };

  cellRenderer(row, dataField, cellValue, rowData, cellText) {

    if(dataField === 'isTradeable') {
      if(typeof rowData.children === 'undefined') {
        return (cellText)?'Yes':'No';
      }
    }

    if(dataField === '') {
      if(typeof rowData.children === 'undefined') {
        return rowData.ticker;
      }
    }

    if(dataField === 'shareLots') {
      if(typeof rowData.children !== 'undefined') {
        return '<span style="font-weight: bold;font-size: 14px">'+cellText+'</span>';
      } else {
        return '-';
      }
    }
    if(dataField === 'marketValue') {
      if(typeof rowData.children !== 'undefined') {
        return '<span style="font-weight: bold;font-size: 14px">'+cellText+'</span>';
      }
    }
    if(typeof rowData.children !== 'undefined'){
      return '<span style="font-weight: bold;font-size: 14px">'+cellText+'</span>';
    }
  }

  dataAdapter = new jqx.dataAdapter(this.source);
  treeGridSettings: jqwidgets.TreeGridOptions =
    {
      height: '450px',
      width: '100%',
      source: this.dataAdapter,
      selectionMode: 'none',
      pageable: true,
      pagerMode: 'default',
      pageSizeMode: 'root',
      pageSize: 10,
      editable: false,
      enableHover: false,
      theme: 'blueleaf',
      columnsResize: false,
      columnsReorder: false,
      filterable: false,
      sortable: true,
      incrementalSearch: true,
      columns: [
        {
          text: "Security ID", datafield: "ticker", width:"15%", align: "center", cellsalign:"left",cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        },
        {
          text: "Security Name", datafield: "", width:"15%", align: "center", cellsalign:"left",cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        },
        {
          text: "Shares", datafield: "shares", width:"15%",cellsformat: "d0", align: "center", cellsalign:"right",cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        },
        {
          text: "No. of Lots", datafield: "shareLots", width:"10%",cellsformat: "d0", align: "center", cellsalign:"right",cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        },
        {
          text: "Market Value (USD)", datafield: "marketValue", width:"10%",cellsformat: "c2", align: "center", cellsalign:"right",cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        },
        {
          text: "Tradeable", datafield: "isTradeable", width:"10%", align: "center", cellsalign:"center",cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        },
        {
          text: "Basis Price (USD)", datafield: "basisPrice", width:"10%",cellsformat: "c2", align: "center", cellsalign:"right",cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        },
        {
          text: "Purchase Date", datafield: "buyDate", width:"15%", align: "center", cellsalign:"right", cellsformat:'MMM dd, yyyy',cellClassName: this.cellClass, cellsRenderer: this.cellRenderer
        }
      ]
    };

  getReport(account) {
    if(account !== 'none') {

      var accountId;
      if(this.portfolio.accounts.length > 1) /*  && account !== 'Household'*/ {
        this.accountSummary.loadSummary(account, this.portfolio);
        accountId = account;
      }/* else if(this.portfolio.accounts.length > 1 && account === 'Household') {
        account = this.portfolio.portfolioName;
        this.accountSummary.loadSummary(this.portfolio.portfolioName);
      }*/else {
        this.accountSummary.loadSummary(this.portfolio.portfolioId);
        accountId = account.accountId;
      }

      this.account = account;

      this.accountService.getPositions(accountId).subscribe((result) => {
        if (result.code == 200) {
          this.positions = [];
          // this.holdingsReportGrid.refreshGrid(result.responsedata);
          for (let count = 0; count < result.responsedata.length; count++) {
            let tickerFound = true;
            if (this.positions.length > 0) {
              for (let positionCount = 0; positionCount < this.positions.length; positionCount++) {
                if (this.positions[positionCount].ticker === result.responsedata[count].ticker) {
                  result.responsedata[count].marketValue = result.responsedata[count].shares * result.responsedata[count].tickerPrice;
                  this.positions[positionCount].shares += result.responsedata[count].shares;
                  this.positions[positionCount].shareLots += 1;
                  this.positions[positionCount].marketValue += result.responsedata[count].shares * result.responsedata[count].tickerPrice;
                  this.positions[positionCount].children.push(result.responsedata[count]);
                  tickerFound = false;
                }
              }
              if (tickerFound) {
                result.responsedata[count].marketValue = result.responsedata[count].shares * result.responsedata[count].tickerPrice;
                this.positions.push(
                  {
                    ticker: result.responsedata[count].ticker,
                    shares: result.responsedata[count].shares,
                    marketValue: result.responsedata[count].shares * result.responsedata[count].tickerPrice,
                    shareLots: 1,
                    children: [result.responsedata[count]]
                  });
              }
            } else {
              result.responsedata[count].marketValue = result.responsedata[count].shares * result.responsedata[count].tickerPrice;
              this.positions.push(
                {
                  ticker: result.responsedata[count].ticker,
                  shares: result.responsedata[count].shares,
                  marketValue: result.responsedata[count].shares * result.responsedata[count].tickerPrice,
                  shareLots: 1,
                  children: [result.responsedata[count]]
                });
            }
          }
          console.log(this.positions)
          setTimeout(()=> {
            this.source.url = undefined;
            this.source.localdata = this.positions;
            this.holdingsReportGrid.updateBoundData();
          }, 300);
          // this.holdingsReportGrid.expandAll();
          // $('#printData').removeClass('slds-hide');
          this.errMsg = '';
          this.disableBtns = false;
        }
        else {
          this.holdingsReportGrid.clear();
          // this.holdingsReportGrid.showemptyrow(true);
          this.errMsg = result.message;
          this.disableBtns = true;
          console.error(result.message);
        }
      });
    }
  }

  printme() {
    this.disableBtns = true;
    this.holdingsReportGrid.exportSettings({fileName: null});
    this.holdingsReportGrid.expandAll();
    let gridContent = this.holdingsReportGrid.exportData('html');

    let newWindow = window.open('', '', 'width=800, height=500'),
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
      }
      catch (error) {
        console.log(error)
      }
    },100);

    this.holdingsReportGrid.collapseAll();
  }

  exportme() {
    this.holdingsReportGrid.exportSettings({fileName: null});
    this.holdingsReportGrid.expandAll();

    let gridCSV = this.holdingsReportGrid.exportData('csv');
    let blob = new Blob([this.generateCSV(gridCSV)], {type: 'text/plain'});
    saveAs(blob,"Holdings-Summary12.csv");

  }

  generateCSV(gridCSV) {
    let accountSummary = this.accountSummary.generateCSV();

    return accountSummary +"\n\n"+ gridCSV;
  }
}
