import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {UrebalGridComponent} from '../../shared/components/urebal-grid/urebal-grid.component';
import {GridLinkInfo} from '../../shared/classes/GridLinkInfo.class';

import {Router} from '@angular/router';
import {URebalUtil} from '../../shared/util/URebalUtil';
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {WorkspaceService} from "../workspace.service";
import {rebalanceListGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";

@Component({
    selector: 'app-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

    @ViewChild('workspacelist') workspacelist: UrebalGridComponent;
    @ViewChild('WorkSpaceDeleteWarning') WorkSpaceDeleteWarning: ModalComponent;
    @ViewChild('WorkSpaceDeleteOK') WorkSpaceDeleteOK: ModalComponent;
    @ViewChild('WorkSpaceDeleteError') WorkSpaceDeleteError: ModalComponent;

    workflowName: string;

    constructor(protected router: Router, private workflowService: WorkspaceService) {
        console.log(this.router.config);

    }

    ngOnInit() {
        $('.dropdown-menu').on('click', function () {
            if ($(this).hasClass('slds-is-open')) {
                $(this).removeClass('slds-is-open');
                return;
            }
            $(this).addClass('slds-is-open');
        });
    }

    OnLinkActive(event: GridLinkInfo) {
        // Call the relevant method as per data in event object
        if (event.linkType == "routeToExecute") {
            this.routeToExecute(event.linkParams["name"]);
        } else if (event.linkType == "routeToEdit") {
            this.router.navigate(['/secure/rebalances/rebalance', URebalUtil.encodeparams(event.linkParams["name"])]);
        } else if (event.linkType == "routeToReport") {
            this.router.navigate(['/secure/rebalances/viewreports', URebalUtil.encodeparams(event.linkParams["name"])]);
        } else if (event.linkType == "deleteWorkspace") {
            this.workflowName = event.linkParams["name"];
            this.WorkSpaceDeleteWarning.open();
        }
    }

    routeToExecute(value: string) {
        this.router.navigate(['/secure/rebalances/executeRebalance', URebalUtil.encodeparams(value)]);
    }

    deleteWorkspace() {
        this.WorkSpaceDeleteWarning.close();
        let workflow = {"name": this.workflowName};
        // delete workspace
        this.workflowService.deleteWorkspace(workflow).subscribe((result) => {
            if (result.code == 200) {
                this.WorkSpaceDeleteOK.open();
                this.workspacelist.refreshGrid();
            } else {
                this.WorkSpaceDeleteError.open();
            }
        });

    }

    rebalanceListGridCols() {
        let data = [
            {
                text: "Rebalance ID",
                align: "center",
                cellsalign: "right",
                datafield: "workflowId",
                width: "12%"
            },
            {
                text: "Rebalance Name",
                align: "center",
                datafield: "name",
                cellsrenderer: "linkRenderer",
                width: "32%"
            },
            {
                text: "No. of Accounts",
                align: "center",
                cellsalign: "right",
                datafield: "totalAccounts",
                "cellsformat": "n",
                cellsrenderer: "cellsRenderer",
                width: "14%"
            },
            {
                text: "No. of Households",
                align: "center",
                cellsalign: "right",
                datafield: "totalHouseholds",
                "cellsformat": "n",
                cellsrenderer: "cellsRenderer",
                width: "14%"
            },
            {
                text: "Total Market Value (USD)",
                align: "center",
                cellsalign: "right",
                datafield: "totalMktVal",
                "cellsformat": "d0",
                cellsrenderer: "cellsRenderer",
                width: "14%"
            },
            {
                text: "Action",
                align: "center",
                cellsalign: "center",
                cellsrenderer: "actionRenderer",
                width: "14%",
                sortable: false
            }
        ]

        SoftpakGridHelper.mergeGridColumnProperties(data, rebalanceListGridColsMeta);

        return data;
    }
}
