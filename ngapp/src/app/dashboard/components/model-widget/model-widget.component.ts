import {Component, OnInit, ViewChild} from '@angular/core';
import {SoftpakGridComponent} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {modelWidgetGridDataSource, modelWidgetGridCols} from "./model-widget.datasource";
import {DashboardService} from "../../dashboard.service";
import {URebalUtil} from "../../../shared/util/URebalUtil";
import {Router} from "@angular/router";
import {UrebalPermissions} from "../../../services/permission-resolver.service";

@Component({
    selector: 'model-widget',
    templateUrl: './model-widget.component.html',
    styleUrls: ['./model-widget.component.css']
})
export class ModelWidgetComponent implements OnInit {

    @ViewChild('modelWidgetGridRef') modelWidgetGrid: SoftpakGridComponent;

    source;
    modelWidgetGridCols;
    modelWidgetGridAdapter;

    constructor(private router: Router,
                public dashboardService: DashboardService,
                public urebalPermissions: UrebalPermissions
    ) {
        this.gridInitializer();
    }

    gridInitializer() {
        this.source = modelWidgetGridDataSource();
        this.modelWidgetGridCols = modelWidgetGridCols(this);
        this.modelWidgetGridAdapter = new jqx.dataAdapter(this.source);
    }

    ngOnInit() {
        this.dashboardService.getTopAssignedModelsByMarketValue().subscribe((response) => {
            if (response.code == 200) {
                let modelsData = response.responsedata;
                this.source.localdata = modelsData;
                this.modelWidgetGrid.updatebounddata();
            }
        });
    }

    routeToModelDetails(modelType, modelName, attributeType, modelId) {
        this.router.navigate(['/secure/model/detail', modelId]);
    }

    modelNameLinkHandler(rowdata) {
        event.preventDefault();
        this.routeToModelDetails(rowdata.modelType, rowdata.modelName, rowdata.modelAttributeType, rowdata.modelId);
    }

}
