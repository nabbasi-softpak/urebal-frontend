import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'taxable-accounts-aggregate',
  templateUrl: './taxable-accounts-aggregate.component.html',
  styleUrls: ['./taxable-accounts-aggregate.component.css']
})
export class TaxableAccountsAggregateComponent implements OnInit {

  totalNumberOfTaxableAccounts : number;
  taxableAccountsMarketValue : number;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getTaxableAccountAgrregatedSummary().subscribe(
      response => {
        if(response.code == 200){
          let result = response.responsedata;
          this.totalNumberOfTaxableAccounts = result.totalTaxableAccounts;
          this.taxableAccountsMarketValue = result.totalMarketValueOfTaxableAccounts;
        }
      },
      error =>
      {
        console.log(error);
      }
    );
  }

}
