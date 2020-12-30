import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'households-aggregate',
  templateUrl: './households-aggregate.component.html',
  styleUrls: ['./households-aggregate.component.css']
})
export class HouseholdsAggregateComponent implements OnInit {

  totalNumberOfHouseholds : number;
  householdMarketValue : number;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getHouseholdAgrregatedSummary().subscribe(
      response => {
        if(response.code == 200){
          let result = response.responsedata;
          this.totalNumberOfHouseholds = result.totalHousehold;
          this.householdMarketValue = result.totalMarketValueOfHouseholds;
        }
      },
      error =>
      {
        console.log(error);
      }
    );
  }
}
