import {Component, OnInit, ViewChild} from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import {DriftStatus} from "../../../account/account.service";
import {DriftService} from "../../../drifts/drift.service";
import {AppConfig} from "../../../../app.config";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'drifted-accounts-aggregate',
  templateUrl: './drifted-accounts-aggregate.component.html',
  providers: [DatePipe]
})
export class DriftedAccountsAggregateComponent implements OnInit {

  totalNumberOfDriftedAccounts : number;
  lastDriftRunDate : Date;
  driftByCategories = {};
  drint_execution_info : string;
  public DATETIME_FORMAT = AppConfig.DATETIME_FORMAT;

  constructor(private dashboardService: DashboardService, private datePipe: DatePipe, private driftService : DriftService, public driftStatus: DriftStatus) {
    this.driftByCategories[DriftStatus.STATUS_CASH_IN] = 0;
    this.driftByCategories[DriftStatus.STATUS_OUT_OF_TOLERANCE] = 0;
    this.driftByCategories[DriftStatus.STATUS_UNASSINGED] = 0;
    this.driftByCategories[DriftStatus.STATUS_ERROR] = 0;
  }

  ngOnInit() {
    this.dashboardService.getDriftedAccountAgrregatedSummary().subscribe(
      response => {
        if(response.code == 200){
          let result = response.responsedata;
          this.totalNumberOfDriftedAccounts = result.totalDriftedAccounts;
          this.lastDriftRunDate = result.lastDriftDate;
        }
      },
      error =>
      {
        console.log(error);
      }
    );

    this.driftService.getDriftExecutionInfo().subscribe( response => {
      if(response.code == 200) {
        let result = response.responsedata;
        this.drint_execution_info = `Drift last run at: ${this.datePipe.transform(result[0]['asOfDate'], this.DATETIME_FORMAT)}`;
      } else if(response.code == 400) {
        this.drint_execution_info = `Drift has not run`;
      }
    });

    this.dashboardService.getDriftByCategories().subscribe(
      response => {
        if(response.code == 200){
          let result = response.responsedata;

          for(let category of result){
            if(category['driftStatus'].includes(DriftStatus.STATUS_OUT_OF_TOLERANCE_AND_CASH_IN)){
              this.driftByCategories[DriftStatus.STATUS_CASH_IN] = category['driftStatusCount'];
            } else if(category['driftStatus'].includes(DriftStatus.STATUS_OUT_OF_TOLERANCE)){
              this.driftByCategories[DriftStatus.STATUS_OUT_OF_TOLERANCE] = category['driftStatusCount'];
            } else if(category['driftStatus'].includes(DriftStatus.STATUS_UNASSINGED)){
              this.driftByCategories[DriftStatus.STATUS_UNASSINGED] = category['driftStatusCount'];
            } else if(category['driftStatus'].includes(DriftStatus.STATUS_ERROR)){
              this.driftByCategories[DriftStatus.STATUS_ERROR] = category['driftStatusCount'];
            }
          }

          let total = this.driftByCategories[DriftStatus.STATUS_CASH_IN] + this.driftByCategories[DriftStatus.STATUS_OUT_OF_TOLERANCE] + this.driftByCategories[DriftStatus.STATUS_UNASSINGED] + this.driftByCategories[DriftStatus.STATUS_ERROR];
          $('#cashIn').val(total == 0? 0 : (this.driftByCategories[DriftStatus.STATUS_CASH_IN]/total) * 100);
          $('#outOfTolerance').val(total == 0? 0 : (this.driftByCategories[DriftStatus.STATUS_OUT_OF_TOLERANCE]/total) * 100);
          $('#Unassigned').val(total == 0? 0 : (this.driftByCategories[DriftStatus.STATUS_UNASSINGED]/total) * 100);
          $('#Error').val((total == 0? 0 : this.driftByCategories[DriftStatus.STATUS_ERROR]/total) * 100);
        }
      }, error => {
        console.log(error);
      });
  }
}
