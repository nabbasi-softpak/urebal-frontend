

export class OverviewType {
    static household = "Household Overview";
    static restrictions = "Restrictions Overview";
    static account = "Account Overview";
}

export class OverviewData {
    model;
    accountList;
    householdName;
    portfolioId;
    isHouseHold;

    constructor({model, accountList, householdName, portfolioId, isHouseHold}) {
        this.model = model;
        this.accountList = accountList;
        this.householdName = householdName;
        this.portfolioId = portfolioId;
        this.isHouseHold = isHouseHold;
    }

    isEmpty(): boolean {
        return this.model == undefined &&
            this.accountList == undefined &&
            this.householdName == undefined &&
            this.portfolioId == undefined &&
            this.isHouseHold == undefined;
    }
}