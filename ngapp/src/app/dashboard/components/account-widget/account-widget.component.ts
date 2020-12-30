import {Component, OnInit, ViewChild} from '@angular/core';
import {accountWidgetGridCols, accountWidgetGridDataSource} from "./account-widget.datasource";
import {SoftpakGridComponent} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {DashboardService} from "../../dashboard.service";
import {Router} from "@angular/router";
import {UrebalPermissions} from "../../../services/permission-resolver.service";


@Component({
    selector: 'account-widget',
    templateUrl: './account-widget.component.html',
    styleUrls: ['./account-widget.component.css']
})
export class AccountWidgetComponent implements OnInit {

    @ViewChild('accountWidgetGridRef') accountWidgetGrid: SoftpakGridComponent;

    source;
    accountWidgetGridCols;
    accountWidgetGridAdapter;

    constructor(private router: Router,
                public dashboardService: DashboardService,
                public urebalPermissions: UrebalPermissions
    ) {
        this.gridInitializer();
    }

    gridInitializer() {
        this.source = accountWidgetGridDataSource();
        this.accountWidgetGridCols = accountWidgetGridCols(this);
        this.accountWidgetGridAdapter = new jqx.dataAdapter(this.source);
    }

    ngOnInit() {
        this.dashboardService.getTopAccountsByMarketValue().subscribe((response) => {
            if (response.code == 200) {
                let accountsData = response.responsedata;
                this.source.localdata = accountsData;
                this.accountWidgetGrid.updatebounddata();
            }
        });
    }

    routeToAccountDetails(portfolioId: string, isHousehold) {
        this.router.navigate(
            ['/secure/accounts/', encodeURIComponent(portfolioId), isHousehold]);
    }

    accountNameLinkHandler(rowdata) {
        event.preventDefault();
        this.routeToAccountDetails(rowdata.portfolioId, rowdata.isHouseHold);
    }

}
