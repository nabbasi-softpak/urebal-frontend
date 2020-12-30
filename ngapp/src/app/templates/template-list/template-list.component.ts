import {Component, OnInit, ViewChild} from '@angular/core';
import {actionButtonClass, UrebalGridComponent} from '../../shared/components/urebal-grid/urebal-grid.component';
import {GridLinkInfo} from "../../shared/classes/GridLinkInfo.class";
import {
  TemplateLinkRendererParams,
  TemplateListEventTypes,
  TemplateListDataColumns,
  TemplateListDataColumnsType,
  TemplateMeta,
  TEMPLATE_DELETION_SUCCESSFUL,
  TEMPLATE_DELETION_FAILED,
  TEMPLATE_WITH_ZERO_ACCOUNTS_DELETE_WARNING_MSG,
  TEMPLATE_DELETE_WARNING_MSG, TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND
} from "./template-list.datasource";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {Router} from "@angular/router";
import {TemplateService} from "../template.service";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {
    templateListGridColsMeta
} from "../../shared/classes/grid-columns.metadata.container";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";

@Component({
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
    styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent extends UrebalPermissions implements OnInit {

    @ViewChild('templateListGrid', {static: true}) templateListGrid: UrebalGridComponent;
    @ViewChild('templateDeleteWarning') templateDeleteWarningModal: ModalComponent;
    @ViewChild('templateDeleteMsgModal') templateDeleteMsgModal: ModalComponent;
    @ViewChild('defaultTemplateNotFoundModal') defaultTemplateNotFoundModal: ModalComponent;

    public template: TemplateMeta;
    public templateDeleteWarningMsg: string = "";
    public templateDeleteMsg: string = "";
    public defaultTemplateNotFoundMessage: string="";

    private readonly _linkRendererParams = [
        {
            click: TemplateListEventTypes.ROUTE_TO_TEMPLATE,
            params: [TemplateLinkRendererParams.TEMPLATE_ID]
        }
    ];
    public get linkRendererParams(): string {
        return JSON.stringify(this._linkRendererParams);
    }

    private readonly _actionItems = [
        {
            item: "Edit",
            click: TemplateListEventTypes.EDIT_TEMPLATE,
            params: [
                TemplateListDataColumns.TEMPLATE_ID
            ],
        },
        {
            item: "Delete",
            click: TemplateListEventTypes.DELETE_TEMPLATE,
            params: [
                TemplateListDataColumns.TEMPLATE_ID,
                TemplateListDataColumns.TEMPLATE_NAME,
                TemplateListDataColumns.NO_OF_ACCOUNTS,
            ]
        },
    ];
    public get actionItems(): string {
        return JSON.stringify(this._actionItems);
    }

    private readonly _actionItemPermissions = [
        {
            "item": "Edit",
            "permissionName": "templateModify"
        }, {
            "item": "Delete",
            "permissionName": "templateDelete"
        }
    ];

    public get actionItemPermissions(): string {
        return JSON.stringify(this._actionItemPermissions);
    }


    private readonly _dataColumns = [
        {name: TemplateListDataColumns.TEMPLATE_ID, type: TemplateListDataColumnsType.NUMBER},
        {name: TemplateListDataColumns.TEMPLATE_NAME, type: TemplateListDataColumnsType.STRING},
        {name: TemplateListDataColumns.NO_OF_ACCOUNTS, type: TemplateListDataColumnsType.NUMBER},
        {name: TemplateListDataColumns.REBALANCE_RULE, type: TemplateListDataColumnsType.STRING}
    ];
    public get dataColumns(): string {
        return JSON.stringify(this._dataColumns);
    }

    constructor(
        private templateService: TemplateService,
        private router: Router,
        permissionResolverService: PermissionResolverService
    ) {
        super(permissionResolverService);
    }

    ngOnInit(): void {
        if (this.isAllowed("templateCreate")) {

            this.templateListGrid.actionButton = new actionButtonClass("Create Template", this.routeToCreateTemplate.bind(this));
        }
    }

    onGridRowLinkClick(event: GridLinkInfo) {
        // Call the relevant method as per data in event object
        if (event.linkType === TemplateListEventTypes.EDIT_TEMPLATE || event.linkType == TemplateListEventTypes.ROUTE_TO_TEMPLATE) {
            const templateId = event.linkParams[TemplateListDataColumns.TEMPLATE_ID];
            const templateName = event.linkParams[TemplateListDataColumns.TEMPLATE_NAME];

            const templateMeta: TemplateMeta = {
                id: templateId,
                name: templateName,
                noOfAccounts: null
            };

            this.routeToEditTemplate(templateMeta);
        } else if (event.linkType == TemplateListEventTypes.DELETE_TEMPLATE) {

            const templateId = event.linkParams[TemplateListDataColumns.TEMPLATE_ID];
            const templateName = event.linkParams[TemplateListDataColumns.TEMPLATE_NAME];
            const noOfAccounts = event.linkParams[TemplateListDataColumns.NO_OF_ACCOUNTS];

            this.template = {
                id: templateId,
                name: templateName,
                noOfAccounts
            };

            if (noOfAccounts > 0) {
              this.templateService.getDefaultRebalanceSettings().subscribe(

                rebalanceSettings => {
                  if (rebalanceSettings) {
                    if (rebalanceSettings.code == 404) {
                      this.defaultTemplateNotFoundMessage = TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND;
                      this.defaultTemplateNotFoundModal.open();
                    } else {
                      this.templateDeleteWarningMsg = TEMPLATE_DELETE_WARNING_MSG(noOfAccounts);
                      this.templateDeleteWarningModal.open();
                    }
                  }

                });



            } else {
                this.templateDeleteWarningMsg = TEMPLATE_WITH_ZERO_ACCOUNTS_DELETE_WARNING_MSG;
              this.templateDeleteWarningModal.open();
            }


        }
    }

    routeToCreateTemplate() {
      this.templateService.getDefaultRebalanceSettings().subscribe(

        rebalanceSettings => {
          if (rebalanceSettings) {
            if (rebalanceSettings.code === 200) {
              this.router.navigate(["secure/templates/create", {
                returnUrl: "secure/templates/list"
              }]);

            } else if(rebalanceSettings.code===404){
              this.defaultTemplateNotFoundMessage = TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND;
              this.defaultTemplateNotFoundModal.open();
            }
          }

        });

    }

    routeToEditTemplate(template: TemplateMeta) {
        this.router.navigate(["secure/templates/edit", template.id, {
            returnUrl: "secure/templates/list"
        }]);
    }

    onDeleteTemplateConfirmed() {
        if (this.template) {
            this.templateDeleteWarningModal.close();

            this.deleteTemplate(this.template.id).subscribe(isDeleted => {
                if (isDeleted) {
                    this.templateDeleteMsg = TEMPLATE_DELETION_SUCCESSFUL;
                } else {
                    this.templateDeleteMsg = TEMPLATE_DELETION_FAILED;
                }

                this.templateDeleteMsgModal.open();
            })
        }
    }

    onCloseTemplateDeleteMsgModal() {
        this.template = null;
        this.templateListGrid.refreshGrid();
        this.templateDeleteMsgModal.close();
    }


  onCloseDefaultTemplateNotFoundMsgModal() {
    this.template = null;
    this.defaultTemplateNotFoundModal.close();
  }


    deleteTemplate(templateId: number): Observable<boolean> {
        return this.templateService.deleteTemplate(templateId).pipe(map(
            response => {
                return response.code == 200;
            }
        ));
    }

    templateListGridCols() {
        let data = [
            {
                text: "Template ID",
                align: "center",
                datafield: TemplateListDataColumns.TEMPLATE_ID,
                width: "0%"
            },
            {
                text: "Template Name",
                align: "center",
                datafield: TemplateListDataColumns.TEMPLATE_NAME,
                cellsrenderer: "linkRenderer",
                width: "40%"
            },
            {
                text: "Accounts",
                align: "center",
                cellsalign: "right",
                datafield: TemplateListDataColumns.NO_OF_ACCOUNTS,
                "cellsformat": "n",
                cellsrenderer: "cellsRenderer",
                width: "14%"
            },
            {
                text: "Rebalance Rule",
                align: "center",
                cellsalign: "right",
                datafield: TemplateListDataColumns.REBALANCE_RULE,
                cellsrenderer: "cellsRenderer",
                width: "32%"
            },
            {
                text: "Action",
                align: "center",
                cellsalign: "center",
                cellsrenderer: "actionRenderer",
                width: "14%",
                sortable: false
            }
        ];

        if (!this.isAllowed("templateModify") && !this.isAllowed("templateDelete")) {
            data = [
                {
                    text: "Template ID",
                    align: "center",
                    datafield: TemplateListDataColumns.TEMPLATE_ID,
                    width: "0%"
                },
                {
                    text: "Template Name",
                    align: "center",
                    datafield: TemplateListDataColumns.TEMPLATE_NAME,
                    cellsrenderer: "linkRenderer",
                    width: "40%"
                },
                {
                    text: "Accounts",
                    align: "center",
                    cellsalign: "right",
                    datafield: TemplateListDataColumns.NO_OF_ACCOUNTS,
                    "cellsformat": "n",
                    cellsrenderer: "cellsRenderer",
                    width: "20%"
                },
                {
                    text: "Rebalance Rule",
                    align: "center",
                    cellsalign: "right",
                    datafield: TemplateListDataColumns.REBALANCE_RULE,
                    cellsrenderer: "cellsRenderer",
                    width: "40%"
                }
            ];
        }

        SoftpakGridHelper.mergeGridColumnProperties(data, templateListGridColsMeta);

        return data;
    }
}
