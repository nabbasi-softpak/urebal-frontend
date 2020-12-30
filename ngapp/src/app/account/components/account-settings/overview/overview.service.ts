import {Injectable} from '@angular/core';
import {ModelService} from "../../../../model/model.service";
import {AccountService} from "../../../account.service";
import {forkJoin, of} from "rxjs";
import {map} from "rxjs/operators";
import {CustomResponse} from "../../../../shared/classes/CustomResponse.class";
import {
    cytoscapeEdge,
    cytoscapeCenterNode,
    cytoscapeNode
} from "./overview-tabs/restriction-overview/restriction-overview.datasource";
import {OverviewHelper} from "./overview.helper";
import {cache, clearCache} from "../../CacheUtil";
import {OverviewType} from "./overview-datatypes";
import {OVERVIEW_DEFAULT_MODEL, OVERVIEW_DEFAULT_OTHERS} from "./overview.datasource";

const CACHE_UNIQ_ID = "OverviewCache";

@Injectable()
export class OverviewService {
    overviewHelper: OverviewHelper = new OverviewHelper();
    private _selectedOverview: OverviewType = null;

    constructor(public modelService: ModelService, public accountService: AccountService) {
    }

    @cache(CACHE_UNIQ_ID)
    getAccountModel(modelId, modelAttributeType) {
        modelAttributeType = modelAttributeType ? modelAttributeType : OVERVIEW_DEFAULT_MODEL;

        return this.modelService.getModelDistributionForAttributeType(modelId, encodeURIComponent(modelAttributeType))
            .pipe(map((response: CustomResponse) => {
                if (response.code == 200) {
                    let modelDetails = response.responsedata;
                    let data = [];
                    let subModels = modelDetails['subModels'];
                    for (let subModel of subModels) {
                        let childPie = [];

                        let modelElements = subModel['modelElements'];

                        for (let modelElement of modelElements) {
                            childPie.push({
                                name: modelElement['ticker'],
                                value: +modelElement['target'],
                                min: +modelElement['min'],
                                max: +modelElement['max']
                            });
                        }

                        data.push({
                            id: subModel['attributeID'],
                            name: subModel['attributeName'],
                            value: subModel['percentage'],
                            securities: childPie
                        });
                    }

                    data = this.overviewHelper.sortPieData(data);

                    return data;
                } else {
                    return [];
                }
            }));
    }

    @cache(CACHE_UNIQ_ID)
    getAttributeDistribution(portfolioId, attributeType) {
        attributeType = attributeType ? attributeType : OVERVIEW_DEFAULT_MODEL;
        const attributeDistribution = `portfolios/${portfolioId}/${attributeType}/attributeDistribution`;
        return this.modelService.get(attributeDistribution);
    }

    getAssetAllocation(portfolioId, attributeType) {
        return this.getAttributeDistribution(portfolioId, attributeType).pipe(map((result) => {
            if (result.code == 200) {
                let attributeDistributions = result.responsedata;
                let flattenAD = {}; //  Flatten Attribute Distributions

                // Converting Account Attribute Distribution to Household Distribution
                // flattenAD = {
                //   [{attr1: 25, attr2: 50}]
                // }
                for (let distribution of attributeDistributions) {
                    const percentage = parseFloat(distribution.percentage);
                    const sleeveRatio = parseFloat(distribution.sleeveRatio);
                    const ratio = percentage * sleeveRatio;

                    if (flattenAD[distribution.attributeName]) {
                        flattenAD[distribution.attributeName] += ratio;
                    } else {
                        flattenAD[distribution.attributeName] = ratio;
                    }
                }

                flattenAD = OverviewHelper.fillRemaining(flattenAD);

                return this.overviewHelper.sortPieData(flattenAD);
            } else {
                return [{'name': OVERVIEW_DEFAULT_OTHERS, value: 100}]
            }
        }));
    }

    getAssetAllocationChartData(portfolioId, attributeType) {
        return this.getAttributeDistribution(portfolioId, attributeType)
            .pipe(map((result) => {
                if (result.code == 200) {
                    let attributeDistributions = result.responsedata;
                    let flattenAD = {};
                    
                    // Merging account attribute distribution under single account
                    // flattenAD = {
                    //   acc1: [{attr1: 25, attr2: 50}]
                    // }
                    for (let distribution of attributeDistributions) {
                        const accountId = distribution.accountId;
                        const attributeName = distribution.attributeName;
                        const percentage = distribution.percentage;

                        if (!flattenAD[accountId])
                            flattenAD[accountId] = {};

                        flattenAD[accountId][attributeName] = percentage;
                    }

                    for (let accountName in flattenAD) {
                        let account = flattenAD[accountName];
                        flattenAD[accountName] = OverviewHelper.fillRemaining(account);
                    }

                    return flattenAD;
                }
                return [];
            }));
    }

    // Interval services are cached.
    getAccountDistribution({householdName, accountList, portfolioId, attributeType}) {
        let [requests, elements] = this.getGraphsElements(householdName, accountList);

        requests.push(this.getAssetAllocationChartData(portfolioId, attributeType));

        return forkJoin(requests)
            .pipe(map((responseList: CustomResponse[]) => {

                let accountAttributeDistributions: any = responseList.pop();

                for (let key in responseList) {
                    const response = responseList[key];

                    if (response.code == 200) {
                        let accountRestrictions = response.responsedata;

                        let singleAccountDistribution = accountAttributeDistributions[accountRestrictions[0].accountID];


                        singleAccountDistribution = this.overviewHelper.sortPieData(singleAccountDistribution);

                        elements = this.appendGraphNodes(key, singleAccountDistribution, elements);
                    }
                }
                return elements;
            }));
    }


    getRestrictionDistribution(householdName, accountList) {
        let [requests, elements] = this.getGraphsElements(householdName, accountList);

        return forkJoin(requests)
            .pipe(map((responseList: CustomResponse[]) => {
                for (let key in responseList) {
                    if (responseList[key].code == 200) {
                        let accountRestrictions = responseList[key].responsedata;
                        accountRestrictions = OverviewHelper.reduceAccountData(accountRestrictions);
                        accountRestrictions = this.overviewHelper.sortPieData(accountRestrictions, 'name');

                        elements = this.appendGraphNodes(key, accountRestrictions, elements);
                    }
                }

                return elements;
            }));
    }

    getAccountAttributesPieFormat(householdName) {
        return this.getAccountAttributes(householdName)
            .pipe(
                map(response => {
                    if (response.code == 200) {
                        let accountRestrictions = response.responsedata;
                        accountRestrictions = OverviewHelper.reduceAccountData(accountRestrictions);

                        let total = 0;
                        for (let restriction of accountRestrictions) {
                            total += restriction.value;
                        }

                        if (total < 100) {
                            const emptyVal = 100 - total;
                            accountRestrictions.push({name: OVERVIEW_DEFAULT_OTHERS, value: emptyVal});
                        }

                        return this.overviewHelper.sortPieData(accountRestrictions, 'name');
                    } else {
                        return null;
                    }
                }));
    }

    @cache(CACHE_UNIQ_ID)
    getAccountAttributes(householdName) {
        return this.accountService.getAccountAttributes(householdName);
    }

    private appendGraphNodes(key, records, elements): any {
        let totalAngle = 0;
        let nodeIndex = (Number(key) * 2) + 1; // +1 to skip household node and * 2 to skip edges

        if (records.length >= 10) {
            console.error("Overview chart only supports 10 attributes per account.");
        }

        for (let idx = 0; idx < records.length; idx++) {
            const value = records[idx].value;
            let pie_id = "pie" + (idx+1); // This pie_id is for cytoscape which range from 1-10
            let angle = value / 10;

            totalAngle += angle;
            elements[nodeIndex].data[pie_id] = angle;
            elements[nodeIndex].data['color'] = '#eeeeee';
        }
        if (totalAngle != 10) {
            elements[nodeIndex].data["pie16"] = 10 - totalAngle;
        }
        return elements;
    }

    private getGraphsElements(householdName, accountList) {
        let label, id, id_edge;
        let elements: any[] = [cytoscapeCenterNode(householdName)];

        let requests = [];
        for (let account of accountList) {
            requests.push(this.getAccountAttributes(account.id));

            label = account.accountName;
            id = account.id;
            id_edge = id + "_edge";
            elements.push(cytoscapeNode(id, label));
            elements.push(cytoscapeEdge(id, id_edge));
        }
        return [requests, elements];
    }

    public getChartColors(): any {
        return this.overviewHelper.getChartColor();
    }

    reset() {
        this.overviewHelper.sortPattern = [];
        clearCache(CACHE_UNIQ_ID);
        this._selectedOverview = null;
    }

    selectedOverview(overview?: OverviewType): OverviewType {
        if (overview) {
            this._selectedOverview = overview;
        }
        else {
            return this._selectedOverview;
        }
    }
}