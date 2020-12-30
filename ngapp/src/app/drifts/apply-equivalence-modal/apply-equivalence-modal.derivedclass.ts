export class AccountEquivalenceAssignment {
    constructor(accountId: any, equivalenceName: any, accountName: any) {
        this.accountId = accountId;
        this.equivalenceName = equivalenceName;
        this.accountName = accountName;
    }

    accountId: String;
    equivalenceName: String;
    accountName: String;
}

export class AccountId {
    accountId: String;

    constructor(accountId: String) {
        this.accountId = accountId;
    }
}