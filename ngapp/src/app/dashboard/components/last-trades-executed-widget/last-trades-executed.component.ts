import {Component, OnInit, ViewChild} from '@angular/core';
import {SoftpakGridComponent} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {lastTradesWidgetGridDataSource, lastTradesWidgetGridCols} from "./last-trades-executed.datasource";
import {DashboardService} from "../../dashboard.service";
import {URebalUtil} from "../../../shared/util/URebalUtil";
import {Router} from "@angular/router";
import {UrebalPermissions} from "../../../services/permission-resolver.service";

@Component({
    selector: 'last-trades-executed-widget',
    templateUrl: './last-trades-executed.component.html',
    styles: []
})
export class LastTradesExecutedComponent implements OnInit {

    @ViewChild('lastTradesWidgetGridRef') lastTradesWidgetGrid: SoftpakGridComponent;

    source;
    lastTradesWidgetGridCols;
    lastTradesWidgetGridAdapter;

    constructor(private router: Router,
                public dashboardService: DashboardService,
                public urebalPermissions: UrebalPermissions) {
        this.gridInitializer();
    }

    gridInitializer() {
        this.source = lastTradesWidgetGridDataSource();
        this.lastTradesWidgetGridCols = lastTradesWidgetGridCols(this);
        this.lastTradesWidgetGridAdapter = new jqx.dataAdapter(this.source);
    }

    ngOnInit() {
        this.dashboardService.getLastTradesExecuted().subscribe((response) => {
            if (response.code == 200) {
                let lastTradesData = response.responsedata;
                this.source.localdata = lastTradesData;
                this.lastTradesWidgetGrid.updatebounddata();
            }
        });
    }

    routeToRebalanceDetails(rebalancename: string) {
        this.router.navigate(['/secure/rebalances/executeRebalance', URebalUtil.encodeparams(rebalancename)]);
    }

    rebalanceNameLinkHandler(rowdata) {
        event.preventDefault();
        this.routeToRebalanceDetails(rowdata.workspaceName);
    }
}

