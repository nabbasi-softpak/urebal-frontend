import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DataImportAccountService} from '../../data-import-account-service';
import {UILoader} from '../../../shared/util/UILoader';
import {URebalService} from "../../../services/urebal.service";


@Component({
    selector: 'app-map-fields',
    templateUrl: './map-fields.component.html',
    styleUrls: ['./map-fields.component.css']
})
export class MapFieldsComponent implements AfterViewInit {

    @Output() progressIndicator = new EventEmitter();
    @Output() successData = new EventEmitter();
    @Output() warningData = new EventEmitter();
    @Output() errorData = new EventEmitter();
    @Output() emptyDataOnBack = new EventEmitter();
    @Output() animateAccordion = new EventEmitter();
    @Input() openAccordion;
    @Input() uploadedFiles: any;
    @Input() mappedData: any;
    @Input() colStrings: any;


    private dataObj: any;
    private columnsObj: any;
    private goNext = false;
    private successArr = [];
    private errorArr = [];
    private warningArr = [];
    public errorMessage: string;
    public showRules: boolean = false;
    private fileCount = 0;


    constructor(public urebalService: URebalService, protected dataImportService: DataImportAccountService) {
    }

    ngAfterViewInit() {
    }

    nextButtonPressed() {

        this.fileCount = 0;
        if (this.mapFieldsValidation()) {
            //looping through each file uploaded.
            for (let i = 0; i < this.mappedData.length; i++) {

                this.dataObj = {
                    "mappingType": this.mappedData[i].type,
                    "fileType": "csv",
                    "header": this.mappedData[i].containsHeader,
                    "dateFormat": this.mappedData[i].dateFormat,
                    "columns": this.mappedData[i].mappedColumns,
                    "fileName": this.mappedData[i].fileName
                };


                for (let key in this.mappedData[i].cols) {
                    for (let m = 0; m < this.mappedData[i].mappedColumns.length; m++) {
                        if (this.mappedData[i].cols[key] == this.mappedData[i].mappedColumns[m].csvColumn) {
                            let arr = key.split('n');
                            this.mappedData[i].mappedColumns[m].columnIndex = parseInt(arr[1]);
                        }
                    }
                }

                UILoader.blockUI.start();
                this.mapFieldsWithServer();
            }
        }
    }

    mapFieldsValidation() {
        for (let i = 0; i < this.mappedData.length; i++) {
            for (let j = 0; j < this.mappedData[i].colVals.length; j++) {
                if (this.mappedData[i].colVals[j] == "false" && (this.mappedData[i].csvFields[j] == "" || typeof this.mappedData[i].csvFields[j] == 'undefined')) {
                    let splitter = this.mappedData[i].data[j].split(':');
                    this.errorMessage = splitter[1] + ' cannot be left empty';
                    return false;
                }
            }
        }
        return true;
    }

    mapFieldsWithServer() {
        console.log(this.dataObj);
        this.dataImportService.mapFields(this.dataObj).subscribe(result => {
            if (result.code == 200) {
                this.fileCount++;
                if (this.fileCount == this.mappedData.length) {
                    this.dataImportService.validateMapping().subscribe(validatedResult => {
                            this.successArr = [];
                            this.warningArr = [];
                            this.errorArr = [];

                            //this.blockUI.stop();
                            UILoader.blockUI.stop();

                            if (validatedResult.code == 400) {
                                for (let i = 0; i < validatedResult.responsedata.length; i++) {
                                    if (validatedResult.responsedata[i].type === 'ERROR') {
                                        this.errorArr.push(validatedResult.responsedata[i]);
                                    }

                                    if (validatedResult.responsedata[i].type === 'WARNING') {
                                        this.warningArr.push(validatedResult.responsedata[i]);
                                    }
                                }

                                if (validatedResult.responsedata.length == 0) {
                                    this.successArr.push('Success');
                                }

                                $('#mapFields').addClass('slds-hide');
                                $('#verifyData').removeClass('slds-hide');
                                $('#mapNext').addClass('slds-hide');
                                $('#verifyDataStep').addClass('active');
                                this.errorMessage = '';
                                this.successData.emit(this.successArr);
                                this.warningData.emit(this.warningArr);
                                this.errorData.emit(this.errorArr);
                                this.progressIndicator.emit(66);

                            } else {
                                this.errorMessage = validatedResult.message;
                            }
                        },
                        () => {
                        },
                        () => {
                            UILoader.blockUI.stop();
                        });
                }
            }
        });
    }

    onChangeCSVFields(value, file, row) {
        let i = this.mappedData.indexOf(file);

        for (let j = 0; j < this.mappedData[i].data.length; j++) {
            let splitter = this.mappedData[i].data[j].split(':');

            if (splitter[1] == row) {
                let colValue = this.mappedData[i].cols[value] == undefined ? "" : this.mappedData[i].cols[value];
                this.mappedData[i].csvFields[j] = value;
                this.mappedData[i].preview[j] = colValue;

                this.goNext = true;
                this.columnsObj = {
                    "columnIndex": j,
                    "csvColumn": this.mappedData[i].csvFields[j],
                    "dbColumn": splitter[0],
                    "ignore": this.mappedData[i].colVals[j] == 'true'
                };

                let index = this.mappedData[i].mappedColumns.findIndex(item => item.dbColumn == splitter[0]);
                if (index > -1) {
                    if (this.columnsObj.dbColumn === this.mappedData[i].mappedColumns[index].dbColumn) {
                        if (this.columnsObj.csvColumn === "") {
                            this.mappedData[i].mappedColumns.splice(index, 1);
                        } else {
                            this.mappedData[i].mappedColumns[index].csvColumn = this.columnsObj.csvColumn;
                        }
                    }
                } else {
                    this.mappedData[i].mappedColumns.push(this.columnsObj);
                }
                break;
            }
        }
    }

    onCheckedAdvanceRules(value, file, row) {
        let splitter = row.split(':');
        let index;
        for (let i = 0; i < this.mappedData.length; i++) {
            if (i == 0) {
                $('#advanceRules' + i).addClass('slds-m-top--x-large');
            }
            $('#advanceRules' + i).removeClass('slds-hide');
            if (this.mappedData[i].filetype == file.filetype) {
                for (let r = 0; r < this.mappedData[i].rules.length; r++) {
                    if (this.mappedData[i].rules[r] === splitter[0]) {
                        index = r;
                    }
                }
                if (value == true) {
                    this.mappedData[i]["rules"].push(splitter[0]);
                } else {
                    this.mappedData[i]["rules"].splice(index, 1);
                    this.mappedData[i]["rules_indexArray"].splice(index, 1);
                }
                this.mappedData[i].mappedColumns = this.mapAdvanceRules(this.mappedData[i].mappedColumns, splitter[0], value);
            }
        }
        this.showHideAdvancedRules();
    }

    //When removing all the added rules, The Advanced rules should stay hidden aswell.
    showHideAdvancedRules() {
        for (let i = 0; i < this.mappedData.length; i++) {
            if (this.mappedData[i].rules.length > 0) {
                this.showRules = true;
                break;
            } else {
                this.showRules = false;
            }
        }
    }

    mapAdvanceRules(mappedColumns, row, value) {
        for (let m = 0; m < mappedColumns.length; m++) {
            if (mappedColumns[m].dbColumn == row) {
                if (value == true) {
                    mappedColumns[m]["replace"] = [{"search": "", "replace": ""}];
                    mappedColumns[m]["transform"] = {"changeCase": "Uppercase"};

                } else {
                    mappedColumns[m]["replaceColumnRuleSet"] = null;
                    mappedColumns[m]["transformColumnRuleSet "] = null;
                }
            }

        }
        return mappedColumns;
    }

    backBtn() {
        $('#uploadFiles').removeClass('slds-hide');
        $('#mapFields').addClass('slds-hide');
        $('#mapNext').addClass('slds-hide');
        $('#mapFieldStep').removeClass('active');

        this.mappedData = [];
        this.errorMessage = '';
        this.emptyDataOnBack.emit();
    }

    accordionAnimate(accordion_index) {
        this.animateAccordion.emit({
            "id": "accordionid",
            "divHeight_id": "divHeightid",
            "index": accordion_index,
            "max_height": 2000
        });
    }

    rulesAccordion(accordion_index) {
        this.animateAccordion.emit({
            "id": "rulesAccordionid",
            "divHeight_id": "rulesDivHeightid",
            "index": accordion_index,
            "max_height": 2000
        });
    }


}
