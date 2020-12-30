import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { AccountService } from '../../../account/account.service';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent {

  public accountDetail: AccountDetail;
  public tax: number = 0;

  constructor(private accountService: AccountService) { }

  loadSummary(id, portfolio = null) {
    this.tax = 0;
    if (portfolio === null) {
      this.accountService.getPortfolioDetailsById(id).subscribe((result) => {
        if (result.code == 200) {
          this.accountDetail = result.responsedata;
          if(result.responsedata.isHouseHold) {

            for(let count =0; count < result.responsedata.accounts.length; count++) {
              if(result.responsedata.accounts[count].isTaxable) {
                this.tax += result.responsedata.accounts[count].marketValue;
              }

            }
          }
        }
      });
    } else {
      this.accountService.getPortfolioDetailsById(portfolio.portfolioId).subscribe((result) => {
        if (result.code == 200) {

          this.tax = -1
          for(let count =0; count < result.responsedata.accounts.length; count++) {
            if(result.responsedata.accounts[count].id === id) {
              let positions = {};
              for(let loop = 0; loop < result.responsedata.accounts[count].positions.length; loop++) {
                positions[result.responsedata.accounts[count].positions[loop].accountPositionId.ticker] = true;
              }

              this.accountDetail = {
                accounts: result.responsedata.accounts,
                portfolioName:result.responsedata.accounts[count].accountName,
                portfolioId: result.responsedata.accounts[count].id,
                isHouseHold: false,
                marketValue:result.responsedata.accounts[count].marketValue,
                positionsCount:Object.keys(positions).length,
                freeCash:-1,
                cash:-1,
                isTaxable: result.responsedata.accounts[count].isTaxable
              }
              break;
            }
          }

        }
      });
    }
  }
  generateCSV() {

    let rows = "";
    let keys  = Object.keys(this.accountDetail);
    for(let count=0;count<keys.length;count++) {
      if(this.accountDetail[keys[count]] !== '') {
        switch(keys[count]) {
          case 'portfolioName':
            rows += "Account Name,"+this.accountDetail[keys[count]]+",";
            break;
          case 'portfolioId':
            rows += "Account ID,"+this.accountDetail[keys[count]]+",";
            break;
          case 'isHouseHold':
            if(this.tax != -1) {
              rows += "Type," + (this.accountDetail[keys[count]] ? "Household" : "Single" )+",";
            }

            if(this.accountDetail[keys[count]]) {
              if (this.tax < 0) {
                rows += "Taxable," + (this.accountDetail[keys[count]] ? "Yes" : "No" )+",";
              } else {
                rows += "Taxable,$" + this.tax+",";
              }
            }

            break;
          case 'marketValue':
            if(this.tax < 0) {
              rows += "Account Market Value,$" + this.accountDetail[keys[count]].toFixed(2).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')+",";
            } else {
              rows += "Total Market Value,$" + this.accountDetail[keys[count]]+",";
            }
            break;
          case 'positionsCount':
            rows += "No. of Holdings,"+this.accountDetail[keys[count]]+",";
            break;
          case 'freeCash':
            if(this.accountDetail[keys[count]] != -1) {
              rows += "Free Cash,$" + this.accountDetail[keys[count]].toFixed(2).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,');
              rows += ",Core Cash,$" + this.accountDetail["cash"].toFixed(2).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')+",";
            }
            break;
        }

      }
      if(count % 3 === 0) {
        rows += "\n";
      }
    }

    return rows;
  }

}

class AccountDetail {
  portfolioName: any;
  isHouseHold: any;
  accounts: any;
  marketValue: any;
  positionsCount: any;
  freeCash: any;
  portfolioId: any;
  cash: any;
  isTaxable: any = false;
};
