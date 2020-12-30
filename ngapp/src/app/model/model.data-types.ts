export class ModelGridSecurities {
    securityId: string;
    target: string = '';
    min: string = '';
    max: string = '';
    invalid: boolean = false;
    validationMessage: string = '';
    error: string = '';
    isPriceMiss: boolean = false;
    tickerName: string = '';
    primaryAssetClass: string = '';
    securityType: string = '';

    constructor(opts?) {
        if (opts !== undefined) {
            Object.assign(this, opts);
        }
    }
}

export class ModelSaveSecurities {
    error: string;
    isEdit: string;
    max: string;
    min: string;
    target: string;
    ticker: string;
    valid: boolean = true;

    constructor(opts?) {
        if (opts !== undefined) {
            Object.assign(this, opts);
        }
    }
}

export enum ModelType {
    SecurityModel = 1,
    AssetModel = 2,
    AssetAllocationMode = 3,
}

export enum MMItemType {
    SECURITY = 'security',
    MODEL = 'model'
}

export class MMGridItem {
    type: MMItemType;
    name: string;
    securityId: string;
    modelId: string;
    securityType: string;
    primaryAssetClass: string;
    target: string = '';
    min: string = '';
    max: string = '';

    constructor(opts?) {
        if (opts !== undefined) {
            Object.assign(this, opts);
        }
    }
}