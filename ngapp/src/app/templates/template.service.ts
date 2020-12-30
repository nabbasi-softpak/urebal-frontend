import {Injectable} from '@angular/core';
import {URebalService} from "../services/urebal.service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";
import {RebalanceTemplateObject} from "../shared/classes/RebalanceTemplate";

@Injectable()
export class TemplateService extends URebalService {

    TEMPLATE_ROOT_URL_SEGMENT = "templates";
    REBALANCE_ROOT_URL_SEGMENT = "RebalanceWS";
    MODEL_ROOT_URL_SEGMENT = "models";

    GET_DEFAULT_REBALANCE_TEMPLATE_URL = `${this.REBALANCE_ROOT_URL_SEGMENT}/getDefaultRebalanceTemplate`;
    GET_SECURITY_TYPES_FOR_TEMPLATE_URL = `${this.REBALANCE_ROOT_URL_SEGMENT}/getSecurityTypesByTemplateId`;
    SAVE_SECURITY_TYPE_ROUNDINGS_TEMPLATE_URL = `${this.REBALANCE_ROOT_URL_SEGMENT}/saveTemplateSecurityTypeByTemplateName?templateName=`;
    GET_MODELS_URL = `${this.MODEL_ROOT_URL_SEGMENT}`;
    SAVE_REBALANCE_TEMPLATE_URL = `${this.TEMPLATE_ROOT_URL_SEGMENT}`;

    GET_TEMPLATE_BY_ID_URL = `${this.TEMPLATE_ROOT_URL_SEGMENT}/template`;

    constructor(http: HttpClient, localStorage: LocalStorageService) {
        super(http, localStorage);
    }

    getDefaultRebalanceSettings() {
        return this.get(this.GET_DEFAULT_REBALANCE_TEMPLATE_URL);
    }

    getSecurityTypesForTemplate(templateId: Number) {
        const params = {
            templateId: templateId
        };

        return this.post(this.GET_SECURITY_TYPES_FOR_TEMPLATE_URL, params);
    }

    getModelsList() {
        return this.get(this.GET_MODELS_URL);
    }

    saveSecurityTypeRoundingsForTemplate(templateName: string, securityTypesList: any[]) {
        return this.post(this.SAVE_SECURITY_TYPE_ROUNDINGS_TEMPLATE_URL + encodeURIComponent(templateName), securityTypesList);
    }

    saveTemplate(template: RebalanceTemplateObject, isEdit: boolean) {
        if (isEdit) {
            return this.put(this.SAVE_REBALANCE_TEMPLATE_URL, template);
        } else {
            return this.postForm(this.SAVE_REBALANCE_TEMPLATE_URL, template);
        }
    }

    getTemplateById(templateId: number) {
        return this.get(`${this.GET_TEMPLATE_BY_ID_URL}/${templateId}`);
    }

    deleteTemplate(templateId: number) {
        return this.delete(`${this.TEMPLATE_ROOT_URL_SEGMENT}/${templateId}`);
    }
}
