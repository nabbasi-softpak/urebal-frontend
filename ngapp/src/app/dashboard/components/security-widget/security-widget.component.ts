import {Component, OnInit, ViewChild} from '@angular/core';
import {SoftpakGridComponent} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {securityWidgetGridDataSource, securityWidgetGridCols} from "./security-widget.datasource";
import {DashboardService} from "../../dashboard.service";


@Component({
  selector: 'security-widget',
  templateUrl: './security-widget.component.html',
  styleUrls: ['./security-widget.component.css']
})
export class SecurityWidgetComponent implements OnInit{

  @ViewChild('securityWidgetGridRef') securityWidgetGrid: SoftpakGridComponent;

  source;
  securityWidgetGridCols;
  securityWidgetGridAdapter;

  constructor(private dashboardService: DashboardService) {
    this.gridInitializer();
  }

  gridInitializer() {
    this.source = securityWidgetGridDataSource();
    this.securityWidgetGridCols = securityWidgetGridCols();
    this.securityWidgetGridAdapter = new jqx.dataAdapter(this.source);
  }

  ngOnInit() {
    this.dashboardService.getTopHeldSecurities().subscribe((response)=>{
      if(response.code == 200){
        let securitiesData = response.responsedata;
        this.source.localdata = securitiesData;
        this.securityWidgetGrid.updatebounddata();
      }
    });
  }


}
