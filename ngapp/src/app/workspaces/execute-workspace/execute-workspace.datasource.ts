import {ExecuteWorkspaceComponent} from "./execute-workspace.component";
import {rebalanceRuleOptions} from "../../templates/template/template.datasource";

export const DEFAULT_TEMPLATE_NOT_FOUND_MSG = "Default rebalance settings have not been configured";

export const selectedTemplateCellRenderer = function(parentComponent: ExecuteWorkspaceComponent, rowIndex, columnfield, value, defaulthtml, columnproperties, templateRowData) {
    if (templateRowData.templateId) {
        const templateId = templateRowData.templateId;

        let linkId = `templateName-link-id-${Math.floor((Math.random() * 1000000) + 1)}`;
        let href = `href="secure/templates/edit/${templateId}"`;

        const templateLinkHTML = `<a ${href} id="${linkId}" class="blueleaf-selected-template--link">${value}</a>`;

        $('body').on('click', `#${linkId}`, parentComponent.routeToTemplate.bind(parentComponent, templateId));
        return templateLinkHTML;
    }
    else {
        return `<i class="material-icons jqx-grid-cell-warning-icon blueleaf-selected-template--icon"
                   title="${parentComponent.defaultTemplateTooltip}">
                        error_outline
                </i>`;
    }
};

export const getRebalanceRule = (rebalanceType: number) => {
    const rebOption = rebalanceRuleOptions.find(option => option.id == rebalanceType);
    return rebOption.type;
};
