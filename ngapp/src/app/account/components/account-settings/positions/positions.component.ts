import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {UrebalGridComponent} from "../../../../shared/components/urebal-grid/urebal-grid.component";

import {AccountService} from '../../../account.service';
import {Observable, of} from "rxjs";
import {UILoader} from "../../../../shared/util/UILoader";
import {PermissionResolverService, UrebalPermissions} from "../../../../services/permission-resolver.service";
import {SoftpakGridHelper} from "../../../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {positionsGridColsMeta} from "../../../../shared/classes/grid-columns.metadata.container";
import {map} from "rxjs/operators";
import {FirmConfig} from "../../../../shared/util/config";

@Component({
    selector: 'app-positions',
    templateUrl: './positions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionsComponent extends UrebalPermissions {

    @ViewChild('positionsGrid') positionsGrid: UrebalGridComponent;

    positions: any = [];
    distinctPositionsCount: number = 0;
    public tradableArr = [];
    public randomText = '';
    private acc_id;
    isSaved: boolean = false;


    @Output() applyChange: EventEmitter<boolean> = new EventEmitter();
    @Output() successMsg = new EventEmitter();

    constructor(private accountService: AccountService,
                permissionResolverService: PermissionResolverService
    ) {
        super(permissionResolverService);
        this.randomText = Math.random().toString(36).substr(2, 9);
    }

    /*@HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
      return !this.positionsChange();
    }*/
    @HostListener("window:beforeunload")
    onBeforeUnload(): Observable<boolean> | boolean {
        return !this.positionsChange();
    }

    positionsChange() {
        if (this.tradableArr.length > 0) {
            return true;
        }
        return false;
    }

    loadPositions(id) {
        this.acc_id = id;
        this.tradableArr = [];
        this.positions = [];
        this.accountService.getPositions(id).subscribe((result) => {
            if (result.code == 200) {
                this.positions = result.responsedata;

                let distinctPositions = (this.positions) ? this.positions.map(item => item.ticker).filter((value, index, self) => self.indexOf(value) === index) : [];
                this.distinctPositionsCount = distinctPositions.length;

                this.positionsGrid.refreshGrid(this.positions);
                this.handlePermissions();
            } else {
                console.error(result.message);
            }
        });
    }

    handlePermissions() {
        if (!this.isAllowed('accountModifyLotStatus'))// No permission found/granted to edit share-lot (Tradable column)
        {
            /** set value to Yes/No **/
            this.positionsGrid.onBindingComplete.subscribe(event => {
                /** change column type from 'checkbox' to 'custom' **/
                this.positionsGrid.jqxGrid.beginupdate();
               // this.positionsGrid.setColumn('isTradeable', 'columntype', 'custom'); // Instead of true or false, the checkbox is made uneditable RBL-2867
                this.positionsGrid.setColumn('isTradeable', 'editable', false);
                this.positionsGrid.jqxGrid.endupdate();
                this.positionsGrid.getRows().forEach(row => {
                    if (row.isTradeable == true || row.isTradeable == 'Yes') {
                        this.positionsGrid.jqxGrid.setcellvalue(row.boundindex, 'isTradeable', 'Yes');
                    } else {
                        this.positionsGrid.jqxGrid.setcellvalue(row.boundindex, 'isTradeable', 'No');
                    }
                });
            });
        } else {
            /** below code makes checkbox uneditable for '$CASH' ticker **/
            this.positionsGrid.jqxGrid.onCellendedit.subscribe(
                cell => {
                    if (this.positionsGrid.jqxGrid.getcellvalue(cell.args.rowindex, 'ticker') == FirmConfig.cashSymbol) {
                        this.positionsGrid.jqxGrid.setcellvalue(cell.args.rowindex, 'isTradeable', cell.args.oldvalue);
                        // this.positions.find(position => position.ticker == FirmConfig.cashSymbol).isTradeable = cell.args.oldvalue;
                        this.positionsGrid.jqxGrid.refresh();
                    }
                });
        }
    }

    selectedTradableRow(event) {
        if (event.rowData.ticker == FirmConfig.cashSymbol) {
            return;
        }

        let selectedRow = Object.assign({}, event.rowData);

        let position = {
            accountId: selectedRow.accountId,
            isTradeable: selectedRow.isTradeable,
            shareLotId: selectedRow.shareLotId,
            ticker: selectedRow.ticker
        };

        let tradedIndex = this.tradableArr.findIndex(
            pos => pos.ticker == position.ticker && pos.shareLotId == position.shareLotId);
        let positionIndex = this.positions.findIndex(
            test => test.ticker == position.ticker && test.shareLotId == position.shareLotId);

        if (tradedIndex < 0) {
            this.tradableArr.push(position);
        } else {
            if (this.positions[positionIndex].isTradeable === position.isTradeable) {
                this.tradableArr.splice(tradedIndex, 1);
            } else {
                this.tradableArr[tradedIndex].isTradeable = position.isTradeable;
            }
        }

        this.applyChange.emit(!this.positionsChange());

    }

    savePositions() : Observable<any> {
      if (this.tradableArr.length == 0) {
        return of("");
      }

      return this.accountService.updateTradablePositions(this.acc_id, this.tradableArr)
        .pipe(map(result => {
          if (result.code == 200) {
            this.tradableArr = [];
            this.successMsg.emit('Account Positions');
            this.isSaved = true;
          } else {
            this.isSaved = false;
          }

          return result;
        }));
    }
    getDataColumns(){
      let data;
      if (!this.isAllowed('accountModifyLotStatus'))// No permission found/granted to edit share-lot (Tradable column)
      {data=
        [
          { "name": "ticker", "type": "string" },
          { "name": "tickerName", "type": "string" },
          { "name": "accountId", "type": "string" },
          { "name": "shareLotId", "type": "string" },
          { "name": "shares", "type": "number" },
          { "name": "basisPrice", "type": "number" },
          { "name": "buyDate", "type": "date" }
        ];
      }else {
        data=[
        { "name": "ticker", "type": "string" },
        { "name": "tickerName", "type": "string" },
        { "name": "accountId", "type": "string" },
        { "name": "shareLotId", "type": "string" },
        { "name": "isTradeable", "type": "string" },
        { "name": "shares", "type": "number" },
        { "name": "basisPrice", "type": "number" },
        { "name": "buyDate", "type": "date" }];
      }
      return data;
    }

    getGridColumns() {
      let data;
      if (!this.isAllowed('accountModifyLotStatus'))// No permission found/granted to edit share-lot (Tradable column)
      {
        data = [
          {
            text:"Security ID",
            datafield: "ticker",
            editable: false,
            cellsrenderer: "cellsRenderer",
            align: "center",
            cellsalign: "left",
            width: "12%"
          },
          {
            text:"Security Name",
            datafield: "tickerName",
            editable: false,
            cellsrenderer: "cellsRenderer",
            align: "center",
            cellsalign: "left",
            width: "50%",

          },
          {
            text:"Shares",
            datafield: "shares",
            editable: false,
            cellsrenderer: "cellsRenderer",
            cellsformat: "d2",
            align: "center",
            cellsalign: "right",
            width: "12%"
          },
          {
            text:"Basis Price (USD)",
            datafield: "basisPrice",
            editable: false,
            cellsrenderer: "cellsRenderer",
            cellsformat: "c2",
            align: "center",
            cellsalign: "right",
            width: "12%"
          },
          {
            text:"Purchase Date",
            datafield: "buyDate",
            editable: false,
            cellsrenderer: "cellsRenderer",
            align: "center",
            cellsalign: "right",
            cellsformat: "MMM dd, yyyy",
            width: "14%"
          }
        ]
      }else {
         data = [
          {
            text:"Security ID",
            datafield: "ticker",
            editable: false,
            cellsrenderer: "cellsRenderer",
            align: "center",
            cellsalign: "left",
            width: "12%"
          },
          {
            text:"Security Name",
            datafield: "tickerName",
            editable: false,
            cellsrenderer: "cellsRenderer",
            align: "center",
            cellsalign: "left",
            width: "40%"
          },
          {
            text:"Shares",
            datafield: "shares",
            editable: false,
            cellsrenderer: "cellsRenderer",
            cellsformat: "d2",
            align: "center",
            cellsalign: "right",
            width: "12%"
          },
          {
            text:"Tradable",
            datafield: "isTradeable",
            align: "center",
            columntype: "checkbox",
            width: "12%",
            cellsalign: "center"
          },
          {
            text:"Basis Price (USD)",
            datafield: "basisPrice",
            editable: false,
            cellsrenderer: "cellsRenderer",
            cellsformat: "c2",
            align: "center",
            cellsalign: "right",
            width: "12%"
          },
          {
            text:"Purchase Date",
            datafield: "buyDate",
            editable: false,
            cellsrenderer: "cellsRenderer",
            align: "center",
            cellsalign: "right",
            cellsformat: "MMM dd, yyyy",
            width: "12%"
          }
        ]
      }





      if (!this.isAllowed('accountModifyLotStatus'))// No permission found/granted to edit share-lot (Tradable column)
      {
        let positionsGridColsMetaCopy = positionsGridColsMeta.filter(h => h.text !== 'Tradable');
        SoftpakGridHelper.mergeGridColumnProperties(data, positionsGridColsMetaCopy);
      }else {
        SoftpakGridHelper.mergeGridColumnProperties(data, positionsGridColsMeta);
      }

        return data;
    }

}
