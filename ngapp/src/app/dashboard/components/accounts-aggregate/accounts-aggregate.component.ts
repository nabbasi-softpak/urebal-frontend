import {Component, OnInit, ViewChild} from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'accounts-aggregate',
  templateUrl: './accounts-aggregate.component.html',
  styleUrls: ['./accounts-aggregate.component.css']
})
export class AccountsAggregateComponent implements OnInit {

  totalTaxableAccounts : number;
  totalMarketValueOfTaxableAccounts : number;
  totalNonTaxableAccounts : number;
  totalMarketValueOfNonTaxableAccounts: number;
  totalHouseholds : number;
  totalMarketValueOfHouseholds : number;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getAccountAgrregatedSummary().subscribe(
      response => {
        if(response.code == 200){
          let result = response.responsedata;
          this.totalTaxableAccounts = result.totalTaxableAccounts;
          this.totalMarketValueOfTaxableAccounts = result.totalMarketValueOfTaxableAccounts;
          this.totalNonTaxableAccounts = result.totalNonTaxableAccounts;
          this.totalMarketValueOfNonTaxableAccounts = result.totalMarketValueOfNonTaxableAccounts;
          this.totalHouseholds = result.totalHousehold;
          this.totalMarketValueOfHouseholds = result.totalMarketValueOfHouseholds;

          // Later we might need this code...............
          // let total = this.totalMarketValueOfTaxableAccounts + this.totalMarketValueOfNonTaxableAccounts + this.totalMarketValueOfHouseholds;
          // $('#individual').val(total == 0? 0 : ((this.totalMarketValueOfTaxableAccounts + this.totalMarketValueOfNonTaxableAccounts)/total) * 100);
          // $('#taxable').val(total == 0? 0 : (this.totalMarketValueOfTaxableAccounts/total) * 100);
          // $('#nonTaxable').val(total == 0? 0 : (this.totalMarketValueOfNonTaxableAccounts/total) * 100);
          // $('#household').val(total == 0? 0 : (this.totalMarketValueOfHouseholds/total) * 100);

        }
      },
      error =>
      {
        console.log(error);
      }
    );
  }

}
