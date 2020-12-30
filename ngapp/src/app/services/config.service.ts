import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {
    accountDriftWidgetGridColsMeta,
    accountListGridColsMeta,
    accountWidgetGridColsMeta,
    compositeModelEditGridColsMeta,
    compositeModelSubModelGridColsMeta,
    driftGridColsMeta,
    editTradeGridColsMeta,
    lastTradesExecutedWidgetGridColsMeta,
    modelDetailGridColsMeta,
    modelListGridColsMeta,
    modelWidgetGridColsMeta,
    positionsGridColsMeta,
    rebalanceAccountsGridColsMeta,
    rebalanceListGridColsMeta,
    rebalanceStockReportGridColsMeta,
    securityAdvancedSearchGridColsMeta,
    securityMasterGridColsMeta,
    securityModelEditGridColsMeta,
    securityWidgetGridColsMeta, templateListGridColsMeta
} from "../shared/classes/grid-columns.metadata.container";
import {catchError} from "rxjs/operators";
import {AppConfig} from "../../app.config";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CustomResponse} from "../shared/classes/CustomResponse.class";

@Injectable()
export class ConfigService {

    constructor(private http: HttpClient) {
    }

    loadConfigJSON() {
        return this.getJSON("assets/config/config.json").toPromise()
            .then((result: any) => {
                if (result) {
                    Object.assign(AppConfig, result);
                }
            });
    }

    loadGridColumnJSON() {
        let JSONFileArray = [
            {filename: 'dashboard-top-accounts.gridcolumns.json', data: accountWidgetGridColsMeta},
            {filename: 'dashboard-top-drifted-accounts.gridcolumns.json', data: accountDriftWidgetGridColsMeta},
            {filename: 'dashboard-top-assigned-model.gridcolumns.json', data: modelWidgetGridColsMeta},
            {filename: 'dashboard-top-held-securities.gridcolumns.json', data: securityWidgetGridColsMeta},
            {filename: 'dashboard-last-trades-executed.gridcolumns.json', data: lastTradesExecutedWidgetGridColsMeta},
            {filename: 'monitoraccounts-account-list.gridcolumns.json', data: accountListGridColsMeta},
            {filename: 'managemodels-model-list.gridcolumns.json', data: modelListGridColsMeta},
            {filename: 'model-details.gridcolumns.json', data: modelDetailGridColsMeta},
            {filename: 'rebalance-rebalance-list.gridcolumns.json', data: rebalanceListGridColsMeta},
            {filename: 'viewsecurities-security-master.gridcolumns.json', data: securityMasterGridColsMeta},
            {filename: 'security-advanced-search.gridcolumns.json', data: securityAdvancedSearchGridColsMeta},
            {filename: 'positions.gridcolumns.json', data: positionsGridColsMeta},
            {filename: 'security-model-edit.gridcolumns.json', data: securityModelEditGridColsMeta},
            {filename: 'composite-model-edit.gridcolumns.json', data: compositeModelEditGridColsMeta},
            {filename: 'composite-model-submodel.gridcolumns.json', data: compositeModelSubModelGridColsMeta},
            {filename: 'rebalance-accounts-list.gridcolumns.json', data: rebalanceAccountsGridColsMeta},
            {filename: 'rebalance-stock-report.gridcolumns.json', data: rebalanceStockReportGridColsMeta},
            {filename: 'templates-template-list.gridcolumns.json', data: templateListGridColsMeta},
            {filename: 'monitoraccounts-drift.gridcolumns.json', data: driftGridColsMeta},
            {filename: 'rebalance-edit-trade.gridcolumns.json', data: editTradeGridColsMeta},
            {filename: 'audit-trail.gridcolumns.json', data: editTradeGridColsMeta}
        ];

        let promiseArray = [];

        JSONFileArray.forEach((item) => {
            const url = "assets/json/" + item.filename;
            promiseArray.push(this.getJSON(url).toPromise()
                .then((result: any) => {
                    if (result) {
                        item.data.push(...result.map(this.extractColDataMap));
                    }
                }));
        });

        return promiseArray;

    }

    private extractColDataMap(obj) {
        const propertiesToExtract = ["text", "hidden"] as any[];

        return propertiesToExtract.reduce((previousValue, currentValue) => {
            if (obj.hasOwnProperty(currentValue)) {
                previousValue[currentValue] = obj[currentValue];
            }
            return previousValue;
        }, {});
    }

    private getJSON(url): Observable<CustomResponse> {
        return this.http.get(url)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status == 200) {
                        console.error(`Invalid JSON found in ${url}`);
                    }
                    return []
                })
            );
    }
}
