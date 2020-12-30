import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {SoftpakGridComponent} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {DashboardService} from "../../dashboard.service";
import {
    driftSummaryWidgetGridCols,
    driftSummaryWidgetGridSource
} from "./driftreport-summary-widget.datasource";
import {UrebalPermissions} from "../../../services/permission-resolver.service";

@Component({
    selector: 'app-driftreport-summary-widget',
    templateUrl: './driftreport-summary-widget.component.html',
    styles: []
})
export class DriftreportSummaryWidgetComponent implements OnInit {

    @ViewChild('driftSummaryWidgetGridRef', {static: true}) driftSummaryWidgetGrid: SoftpakGridComponent;

    source;
    driftSummaryWidgetGridCols;
    driftSummaryWidgetGridAdapter;

    constructor(private router: Router,
                public dashboardService: DashboardService,
                public urebalPermissions: UrebalPermissions) {
        this.gridInitializer();
    }

    gridInitializer(){
        this.source = driftSummaryWidgetGridSource();
        this.driftSummaryWidgetGridCols = driftSummaryWidgetGridCols(this);
        this.driftSummaryWidgetGridAdapter = new jqx.dataAdapter(this.source);
    }

    ngOnInit() {
        this.dashboardService.getTopDriftedAccounts().subscribe((response) => {
            if (response.code == 200) {
                let accountsDriftData = response.responsedata;
                this.source.localdata = accountsDriftData;
                this.driftSummaryWidgetGrid.updatebounddata();
            }
        });
    }

    routeToAccountDetails(portfolioId:string,  isHousehold){
        this.router.navigate(['/secure/accounts/',encodeURIComponent(portfolioId) ,isHousehold]);
    }

    accountNameLinkHandler(rowdata){
        event.preventDefault();
        this.routeToAccountDetails(rowdata.portfolioId, rowdata.isHouseHold);
    }


}
