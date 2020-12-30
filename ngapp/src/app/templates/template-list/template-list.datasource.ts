
export enum TemplateListEventTypes {
    ROUTE_TO_TEMPLATE = "routeToTemplate",
    EDIT_TEMPLATE = "editTemplate",
    DELETE_TEMPLATE = "deleteTemplate"
}

export enum TemplateLinkRendererParams {
    TEMPLATE_ID = "templateId"
}

export enum TemplateListDataColumns {
    TEMPLATE_ID = "templateId",
    TEMPLATE_NAME = "name",
    NO_OF_ACCOUNTS = "accounts",
    REBALANCE_RULE = "rebalanceRule"
}

export enum TemplateListDataColumnsType {
    NUMBER = "number",
    STRING = "string",
}

export interface TemplateMeta {
    id: number;
    name: string;
    noOfAccounts: null | number;
}

export const TEMPLATE_WITH_ZERO_ACCOUNTS_DELETE_WARNING_MSG = 'Do you want to delete the template?';
export const TEMPLATE_DELETE_WARNING_MSG = (noOfAccounts: number) => {
    return `Rebalance settings for ${noOfAccounts} associated account(s) will be reset to default. Continue?`;
};

export const TEMPLATE_DELETION_SUCCESSFUL = 'Template deleted successfully.';
export const TEMPLATE_DELETION_FAILED = 'Template deletion failed.';
export const TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND = 'Operation failed. Default rebalance settings have not been configured';
