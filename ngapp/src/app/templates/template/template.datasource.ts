import set = Reflect.set;

export interface TemplateTab {
    id: string;
    title: string;
    isAllowed: boolean;
    target: string;
}

export enum TemplateTabs {
    REBALANCE_SETTINGS = "Rebalance Settings",
    REBALANCE_SETTINGS_TARGET = "tab-rebalance",

    GENERAL_SETTINGS = "General Settings",
    GENERAL_SETTINGS_TARGET= "tab-general",

    TAX_SETTINGS= "Tax Settings",
    TAX_SETTINGS_TARGET= "tab-tax"
}

export enum RebalanceRule {
    REBALANCE_TO_TARGET = "Rebalance to Target",
    REBALANCE_TO_TOLERANCE = "Rebalance to Tolerance",
    GENERATE_CASH = "Generate Cash",
    INVEST_CASH = "Invest Cash",
    REBALANCE_TO_ASSET_ALLOCATION = "Rebalance to Asset Allocation",
    REBALANCE_WITH_IN_MODEL_SLEEVE = "Rebalance Within Model Sleeve",
    HARVEST_GAIN = "Harvest Gain",
    HARVEST_LOSS = "Harvest Loss"
}

export interface RebalanceRuleOption {
    id: number;
    type: RebalanceRule,
    disabled: boolean,
    hidden: boolean,
    title: string,
}

export interface RebalanceSettings {
    templateId: number;
    templateName: string;

    /* Rebalance Settings */
    rebalanceType: number;
    cashToGenerate: number;

    // Objective Function Settings
    isObjFunction: boolean;
    scalarRank: number;
    scalarVariance: number;
    buyTransactionCost: number;
    sellTransactionCost: number;
    rankSetID: string;
    isReinvest: boolean;


    /* General Settings */
    // Boolean Settings
    isSecurityTypeRounding: boolean;
    isWashsalesApply: boolean;
    isEquivalenceApply: boolean;
    isEquivalenceBuyRulesApply: boolean;
    isEquivalenceSellRulesApply: boolean;

    isRestrictionApply: boolean;
    isAttributesApply: boolean;
    isModelAttributesApply: boolean;
    isMTSApply: boolean;

    minTradeSize: number;
    model: any;
    subModel: string;

    // Advanced Equivalence Settings
    equivalenceBuySplitRules: string;
    equivalenceSellSplitRules: string;

    // Rounding Settings
    lotOrder: string;
    roundSellDirection: string;
    roundBuyDirection: string;
    roundNearestUnit: string;


    /* Tax Settings */
    gainLossToHarvest: number;
    sellStrategy: string;
}

export interface TemplateSecurityTypeRounding {
    templateId: string;
    templateName: string;
    roundBuyDirection: string;
    roundSellDirection: string;
    roundNearestUnit: string | number;
    securityType: string;
}

export enum ModelType {
    SECURITY_MODEL,
    ASSET_ALLOCATION_MODEL,
    COMPOSITE_MODEL
}

export interface EquivalenceBreakdownRules {[rule: string]: string}

export interface ModelMeta {
    id: number;
    name: string;
    modelTypeNum: number;
}

export const getTemplateTabs = (isAllowed: (string) => boolean): TemplateTab[] => {
    return [
        {
            id: TemplateTabs.REBALANCE_SETTINGS,
            title: TemplateTabs.REBALANCE_SETTINGS,
            isAllowed: true,
            target: TemplateTabs.REBALANCE_SETTINGS_TARGET
        },
        {
            id: TemplateTabs.GENERAL_SETTINGS,
            title: TemplateTabs.GENERAL_SETTINGS,
            isAllowed: true,
            target: TemplateTabs.GENERAL_SETTINGS_TARGET
        },
        {
            id: TemplateTabs.TAX_SETTINGS,
            title: TemplateTabs.TAX_SETTINGS,
            isAllowed: isAllowed("accountModifyTaxSettings"),
            target: TemplateTabs.TAX_SETTINGS_TARGET
        }
    ];
};

export const rebalanceRuleOptions: RebalanceRuleOption[] = [
    {id: 0, type: RebalanceRule.REBALANCE_TO_TARGET, disabled: false, hidden: false, title: 'All securities are rebalanced to meet their benchmark targets'},
    {id: 1, type: RebalanceRule.REBALANCE_TO_TOLERANCE, disabled: false, hidden: false, title: 'All securities are rebalanced to meet their benchmark tolerance bands'},
    {id: 2, type: RebalanceRule.GENERATE_CASH, disabled: false, hidden: false, title: 'Rebalance with buying disabled to generate specified cash amount'},
    {id: 3, type: RebalanceRule.INVEST_CASH, disabled: false, hidden: false, title: 'Rebalance with selling disabled and buys proposed using available cash'},
    {id: 4, type: RebalanceRule.REBALANCE_TO_ASSET_ALLOCATION, disabled: false, hidden: false, title: 'All securities are rebalanced to bring attributes within min/max ranges'},
    {id: 5, type: RebalanceRule.REBALANCE_WITH_IN_MODEL_SLEEVE, disabled: false, hidden: false, title: 'All Securities are rebalanced to meet their sub-model weights, total weight of sub-model remains unchanged'},
    {id: 7, type: RebalanceRule.HARVEST_GAIN, disabled: false, hidden: false, title: 'N/A'},
    {id: 8, type: RebalanceRule.HARVEST_LOSS, disabled: false, hidden: false, title: 'N/A'}
];

export const sellLotOrderingStrategies: {[key: string] : string} = {
    'FIFO': 'Sell the earliest purchased lots first (FIFO)',
    'LIFO': 'Sell the recent purchased lots first (LIFO)',
    'MinTax': 'Sell the lots with minimum tax first (Min.Tax)',
    'MaxTax': 'Sell the lots with maximum tax first (Max.Tax)',
    'HIFOLoss': 'Sell the lots with highest loss first (HIFO Loss)',
    'HIFOGain': 'Sell the lots with highest gain first (HIFO Gain)',
    'HIFOCost': 'Sell the lots with highest cost first (HIFO Cost)',
    'AverageCost': 'Sell the lots in FIFO averaging cost (Average Cost)'
};

export const taxSortingStrategies: {[key: string] : string} = {
    'LOSS-FIRST': 'Sell Loss securities first',
    'GAIN-FIRST': 'Sell Gain securities first',
    'CONVERGE-TO-ZERO': 'Converge towards zero Gain-Loss'
};

export const transformRebSettingsResponse = (settings: any): RebalanceSettings => {
    let roundNearestUnit = settings.roundNearestUnit;

    if (roundNearestUnit == 0) {
        roundNearestUnit = DO_NOT_ROUND;
    }

    return {
        buyTransactionCost: settings.buyTransactionCost,
        cashToGenerate: settings.cashToGenerate,
        isEquivalenceBuyRulesApply: settings.isEquivalenceBuyRulesApply,
        isEquivalenceSellRulesApply: settings.isEquivalenceSellRulesApply,
        equivalenceBuySplitRules: settings.equivalenceBuySplitRules,
        equivalenceSellSplitRules: settings.equivalenceSellSplitRules,
        gainLossToHarvest: settings.gainLossToHarvest,
        isAttributesApply: settings.isAttributesApply,
        isEquivalenceApply: settings.isEquivalenceApply,
        isMTSApply: settings.isMTSApply,
        isModelAttributesApply: settings.isModelAttributesApply,
        isObjFunction: settings.isObjFunction,
        isReinvest: settings.isReinvest,
        isRestrictionApply: settings.isRestrictionApply,
        isSecurityTypeRounding: settings.isSecurityTypeRounding,
        isWashsalesApply: settings.isWashsaleApply,
        lotOrder: settings.lotOrder,
        minTradeSize: settings.minTradeSize,
        model: settings.model,
        rankSetID: settings.rankSetID,
        rebalanceType: settings.rebalanceType,
        roundBuyDirection: settings.roundBuyDirection,
        roundNearestUnit: roundNearestUnit,
        roundSellDirection: settings.roundSellDirection,
        scalarRank: settings.scalarRank,
        scalarVariance: settings.scalarVariance,
        sellStrategy: settings.sellStrategy,
        sellTransactionCost: settings.sellTransactionCost,
        subModel: settings.subModel,
        templateId: settings.templateId,
        templateName: settings.templateName
    };
};

export const DO_NOT_ROUND: string = "Do not round";
export const roundLotSizeOptions = [DO_NOT_ROUND, 1, 5, 10, 25, 50, 75, 100, 500, 1000];
export const directionArray = ['UP', 'DOWN'];
export const roundDirections = ['UP', 'DOWN'];

export const getModelType = (modelNum: number): ModelType | undefined => {
    switch (modelNum) {
        case 1:
            return ModelType.SECURITY_MODEL;
        case 3:
            return ModelType.ASSET_ALLOCATION_MODEL;
        case 4:
            return ModelType.COMPOSITE_MODEL;

        default:
            return undefined;
    }
};

// Template Messages
export const REBALANCE_SETTINGS_RETRIEVAL_FAILED = "Failed to retrieve Rebalance Settings";
export const TEMPLATE_SECURITY_TYPE_ROUNDING_RETRIEVAL_FAILED = "Failed to retrieve Security type roundings";
export const BREAK_DOWN_RULES_EMPTY = "Buy/Sell rules are empty. Please select at least one breakdown rule.";
export const ERROR_MSG_ENTER_TEMPLATE_NAME = "Please enter template name";
export const ERROR_MSG_TEMPLATE_NAME_ALREADY_EXIST = "Template Name already exist.";
export const ERROR_MSG_SAVING_SEC_TYPE_ROUNDING_FAILED = "Failed to save security type rounding information";
export const ERROR_MSG_NO_MODEL_SELECTED = "No model selected";
export const ERROR_MSG_SECURITY_MODEL_SELECTED = "Security Model selected";
export const ERROR_MSG_TEMPLATE_RETRIEVAL_FAILED = "Failed to Retrieve Template";

export const SUCCESS_MSG_TEMPLATE_SAVED = "Template saved successfully.";

const EQ_BREAKDOWN_RULE_HIGHEST_TRADEABLE_PCT = "Highest Tradable PCT";
const EQ_BREAKDOWN_RULE_SECURITY_NAME = "Security Name";
const EQ_BREAKDOWN_RULE_NORMAL_LOT_ORDER = "Normal Lot Order";
const NO_EQ_BREAKDOWN_RULE = "-";

export const EQUIV_BREAKDOWN_RULES_SPLIT_DELIMITER = ",";

export interface EquivalenceBreakdownRule {
    id: string;
    name: string;
    value: string;
}

export const equivBuyRules: EquivalenceBreakdownRule[] = [
    { id: "0", name: EQ_BREAKDOWN_RULE_HIGHEST_TRADEABLE_PCT, value: "-1" },
    { id: "1", name: EQ_BREAKDOWN_RULE_SECURITY_NAME, value: "-1" },
    { id: "-1", name: NO_EQ_BREAKDOWN_RULE, value: "-1" }
];

export const equivSellRules: EquivalenceBreakdownRule[] = [
    { id: "0", name: EQ_BREAKDOWN_RULE_HIGHEST_TRADEABLE_PCT, value: "-1" },
    { id: "1", name: EQ_BREAKDOWN_RULE_SECURITY_NAME, value: "-1" },
    { id: "2", name: EQ_BREAKDOWN_RULE_NORMAL_LOT_ORDER, value: "-1" },
    { id: "-1", name: NO_EQ_BREAKDOWN_RULE, value: "-1" }
];

export const rankSetSecuritiesGridDataColumns = [
    { "name": "securityID", "type": "string" },
    { "name": "rank", "type": "number" }
];

export const rankSetSecuritiesGridColumns = [
    {
        "text": "Ticker",
        "datafield": "securityID",
        "width":"70%",
        "cellsrenderer":"cellsRenderer",
        "align": "center"
    },
    {
        "text": "Ranks",
        "datafield": "rank",
        "width":"30%",
        "cellsrenderer":"cellsRenderer",
        "cellsformat": "d2",
        "align": "center",
        "cellsalign":"right"
    }
];
