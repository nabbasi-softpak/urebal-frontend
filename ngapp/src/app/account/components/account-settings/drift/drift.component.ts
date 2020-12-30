import {Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {DriftService} from "../../../../drifts/drift.service";
import {UrebalGridComponent} from "../../../../shared/components/urebal-grid/urebal-grid.component";
import {UILoader} from "../../../../shared/util/UILoader";
import {driftDataColumns, driftGridColumns, driftRowRenderColumns} from "./drift.datasource";

@Component({
    selector: 'app-drift',
    templateUrl: './drift.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriftComponent implements OnInit {

    private driftReportResponse: any;
    public driftDate: string;
    public driftReport: any;
    public totalSecuritiesDrifted: number = null;
    public driftDataExists: boolean = false;
    public errorMessage: string = "Selected account has not been rebalanced";

    @ViewChild('driftGridRef') gridComponent: UrebalGridComponent;

    driftDataColumns: any[] = null;
    driftGridColumns: any[] = null;
    driftRowRenderColumns: any[] = driftRowRenderColumns;

    constructor(private driftService: DriftService, private ref: ChangeDetectorRef) {
        this.driftDataColumns = driftDataColumns();
        this.driftGridColumns = driftGridColumns.call(null, this.driftService);
    }

    ngOnInit() {}

    loadDriftReport(acc_id: any) {
        UILoader.blockUI.start();
        this.driftService.getDriftReport(acc_id).subscribe(result => {
            if (result.code == 200 && result.responsedata && result.responsedata.length > 0) {
                this.driftDataExists = true;
                this.ref.detectChanges();

                this.driftReportResponse = this.driftReport = result.responsedata;

                this.setGridData(this.driftReportResponse);
                this.setTotalSecuritiesDrifted(this.driftReport);
            } else {
                this.driftDataExists = false;
            }

        })
    }

    setGridData(data: any) {
        this.gridComponent.refreshGrid(data);
    }


    setTotalSecuritiesDrifted(driftReport) {
        let threshold = 0;
        this.totalSecuritiesDrifted = 0;
        for (let i = 0; i < driftReport.length; i++) {
            if (driftReport[i].drift > threshold) {
                this.totalSecuritiesDrifted++;
            }
        }
    }

    setErrorMessage(message: string) {
        this.errorMessage = message;
        this.ref.detectChanges();
    }

}
