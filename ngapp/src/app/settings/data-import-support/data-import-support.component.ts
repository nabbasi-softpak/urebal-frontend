import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {columnsSupportImport, sourceSupportImport} from "./data-import-support.datasource";
import {DataImportService} from "../data-imports/data-import.service";
import {catchError, map} from "rxjs/operators";
import {UILoader} from "../../shared/util/UILoader";
import {URebalService} from "../../services/urebal.service";

export const DEFAULT_UPLOAD_MESSAGE = "Choose file";

@Component({
    selector: 'app-data-import-support',
    templateUrl: './data-import-support.component.html',
    styleUrls: ['./data-import-support.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataImportSupportComponent implements OnInit {
    @ViewChild("refImportSupport") refImportSupport: SoftpakGridComponent;

    sourceModelEdit: any = sourceSupportImport;
    dataAdapterImportSupport: any = new jqx.dataAdapter(this.sourceModelEdit);
    columnsImportSupport: any[];
    uploadSupportFileConfig = {
        fileStatus: DEFAULT_UPLOAD_MESSAGE,
        hideClose: true,
        disableUpload: true,
        fileToUpload: null
    };

    constructor(public dataImportService: DataImportService, public urebalService: URebalService, public ref: ChangeDetectorRef) {
        this.columnsImportSupport = columnsSupportImport.call(null, this, this.refImportSupport);
    }

    ngOnInit(): void {
        this.loadSupportData().subscribe(() => {
        });
    }

    loadSupportData() {
        UILoader.blockUI.start("Loading...");
        return this.dataImportService.getSupportDataList().pipe(map((result) => {
            if (result.code == 200) {
                this.sourceModelEdit.localdata = result.responsedata;
                this.refImportSupport.updatebounddata();
            } else {
                console.error(result);
            }
            UILoader.blockUI.stop();
        }));
    }

    deleteSupportData(data) {
        return this.dataImportService
            .deleteSupportData(data)
            .pipe(map((result) => {
                if (result.code == 200) {
                    this.loadSupportData().subscribe();
                    alert("Support list marked as resolved.");
                } else {
                    alert("Failed to resolve support list.");
                }
            }), catchError((err, caught) => {
                console.error(err);
                alert("Failed to resolve support list.");
                return null;
            }))
    }

    clickGridMarkAsResolved(rowId) {
        let rowData: any = this.refImportSupport.getrowdatabyid(rowId);
        let dataName = rowData.metaId + "_" + rowData.name;
        let message = `WARNING\n\nDo you really want to mark "${dataName}" as resolved? \n\nNOTE: This action cannot be reverted.`;

        // Note: Using confirm() here because DialogModalComponent have cyclic dependency issue when importing in this component.
        if (confirm(message)) {
            let data = {
                metaId: rowData.metaId
            };

            this.deleteSupportData(data).subscribe();
        }
    }

    onCellClick($event: any) {
        let args = $event.args;
        let rowBoundIndex = args.rowindex;
        let dataField = args.datafield;
        let cell: any = this.refImportSupport.getcell(rowBoundIndex, dataField);
        if (cell.column == "resolved" && cell.value == false) {
            this.clickGridMarkAsResolved(cell.row)
        }
    }

    selectFile($event: Event) {
        let files: FileList = $event.target['files'];

        this.uploadSupportFileConfig.fileToUpload = files.item(0);
        const fileName = this.uploadSupportFileConfig.fileToUpload.name;

        this.uploadSupportFileConfig.fileStatus = fileName;

        if (fileName.indexOf(".ur") == -1) {
            this.uploadSupportFileConfig.fileStatus = "<span class='error-text-red'>ERROR: This is not a .ur file.</span>";
        }
        else {
            this.uploadSupportFileConfig.hideClose = false;
            this.uploadSupportFileConfig.disableUpload = false;
        }

        this.ref.detectChanges();
        $event.target['value'] = "";
    }

    cleanFile() {
        this.uploadSupportFileConfig.fileStatus = DEFAULT_UPLOAD_MESSAGE;
        this.uploadSupportFileConfig.hideClose = true;
        this.uploadSupportFileConfig.disableUpload = true;
        this.uploadSupportFileConfig.fileToUpload = null;
        this.ref.detectChanges();
    }

    uploadSupportFile($event: MouseEvent) {
        let formData = new FormData();
        formData.append('file',  this.uploadSupportFileConfig.fileToUpload);
        this.dataImportService.uploadSupportData(formData).pipe(map((result) => {
           if (result.code == 200) {
               this.loadSupportData().subscribe();
               alert("File loaded successfully.");
           } else {
               console.error(result);
               alert("Failed to load support file.");
           }
           this.cleanFile();
        })).subscribe();
    }
}
