import {UrebalGridComponent} from '../components/urebal-grid/urebal-grid.component'
import {GridLinkInfo} from '../../shared/classes/GridLinkInfo.class';
import * as numeral from 'numeral';
import {URebalUtil} from './URebalUtil';
import {UrebalPermissions} from '../../services/permission-resolver.service';


const dateFormat: string = "dd-MM-yyyy";
const numberFormat: string = "n";

export class GridUtils {
    private _rowRendererColumns: any;
    private _negativeValueColumns: any; //JSON string
    private _linkRendererParams: string; //JSON string
    private _linkRendererPermissions: string; //JSON string
    private _actionItems: string;
    private _actionItemsPermissions: string;
    private _debug: any;
    private _sanitizer: any;
    private _jqxFormatter: any;
    private _linkCounter: number;           // used to uniquely identify each rendered link
    private _linkColumnsCount: number;       // how many columns with type of linksrendered were provided
    private _actionItemsCount: number;
    private _linkRendererDataIndex: number;  // currently rendered link column -> required when there are multiple link columns
    private _actionItemsDataIndex: number;
    private _gridId: string;
    private _LinkMap: { [id: string]: GridLinkInfo; } = {};
    private _actionCounter = 0;
    private _widgetCounter = 1;
    private _customTooltipParam: string;
    private appContext: string;

    constructor(private component: UrebalGridComponent,
                private urebalPermissions: UrebalPermissions,
                debug?: boolean
    ) {
        this._debug = debug;
        this._linkCounter = 0;
        this._linkColumnsCount = 0;
        this._linkRendererDataIndex = 0;
        this.appContext = component.urebalService.getAppContext();
    }

    set linkColumnsCount(count: number) {
        if (this._debug) {
            console.log('Setting _linkColumnsCount to ' + count);
        }
        this._linkColumnsCount = count;
    }

    get linkColumnsCount() {
        return this._linkColumnsCount;
    }

    get actionItemsCount(): number {
        return this._actionItemsCount;
    }

    set actionItemsCount(count: number) {
        if (this._debug) {
            console.log('Setting _actionItemsCount to ' + count);
        }
        this._actionItemsCount = count;
    }

    get rowRendererColumns(): any {
        return this._rowRendererColumns;
    }

    get negativeValueColumns(): any {
        return this._negativeValueColumns;
    }

    set negativeValueColumns(negativeValueColumns: any) {
        if (this._debug) {
            console.log('Setting _rowRendererColumns to ' + negativeValueColumns);
        }
        this._negativeValueColumns = negativeValueColumns;
    }

    set rowRendererColumns(rowRendererColumns: any) {
        if (this._debug) {
            console.log('Setting _rowRendererColumns to ' + rowRendererColumns);
        }
        this._rowRendererColumns = rowRendererColumns;
    }

    get linkRendererParams(): string {
        return this._linkRendererParams;
    }

    set linkRendererParams(linkRendererParams: string) {
        if (this._debug) {
            console.log('Setting _linkRendererParams to ' + linkRendererParams);
        }
        this._linkRendererParams = linkRendererParams;
    }

    get customTooltipParam(): string {
        return this._customTooltipParam;
    }

    set customTooltipParam(customTooltipParam: string) {
        if (this._debug) {
            console.log('Setting _customTooltipParam to ' + customTooltipParam);
        }
        this._customTooltipParam = customTooltipParam;
    }

    get linkRendererPermissions(): string {
        return this._linkRendererPermissions;
    }

    set linkRendererPermissions(linkRendererPermissions: string) {
        if (this._debug) {
            console.log('Setting _linkRendererPermissions to ' + linkRendererPermissions);
        }
        this._linkRendererPermissions = linkRendererPermissions;
    }

    get sanitizer(): any {
        return this._sanitizer;
    }

    set sanitizer(sanitizer: any) {
        if (this._debug) {
            console.log('Setting _sanitizer to ' + sanitizer);
        }
        this._sanitizer = sanitizer;
    }

    get jqxFormatter(): any {
        return this._jqxFormatter;
    }

    set jqxFormatter(jqxFormatter: any) {
        if (this._debug) {
            console.log('Setting _jqxFormatter to ' + jqxFormatter);
        }
        this._jqxFormatter = jqxFormatter;
    }

    get gridId(): string {
        return this._gridId;
    }

    set gridId(gridId: string) {
        if (this._debug) {
            console.log('Setting _gridId to ' + gridId);
        }
        this._gridId = gridId;
    }

    get actionItems(): string {
        return this._actionItems;
    }

    set actionItems(actionItems: string) {
        if (this._debug) {
            console.log('Setting _actionItems to ' + actionItems);
        }
        this._actionItems = actionItems;
    }

    get actionItemsPermissions(): string {
        return this._actionItemsPermissions;
    }

    set actionItemsPermissions(actionItemsPermissions: string) {
        if (this._debug) {
            console.log('Setting _actionItemsPermissions to ' + actionItemsPermissions);
        }
        this._actionItemsPermissions = actionItemsPermissions;
    }

    private typeCastValue(value: any): any {
        if (typeof (value) !== "string") {
            return numeral(value).format('0.000');
        } else if (typeof (value) === "boolean") {
            return value ? "Yes" : "No";
        } else {
            return value;
        }
    }

    private stringFormatter(value: string): string {
        return value === "" ? "--" : value;
    }

    // linkRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    //   if(this.linkRendererParams != undefined){
    //
    //     let parseLinkAndParams = JSON.parse(this.linkRendererParams);
    //
    //     if(! (parseLinkAndParams instanceof Array)){
    //       console.log("Error: linkRendererParams should be an array.");
    //       return;
    //     }
    //
    //     if(this.linkColumnsCount != parseLinkAndParams.length)
    //     {
    //       console.log("Error: linkRendererParams not provided for all columns having linkRenderer.");
    //       return;
    //     }
    //
    //     let paramValue: string = "";
    //     let linkID = this.gridId+'-link-';
    //     let linkInfo = parseLinkAndParams[this._linkRendererDataIndex++];
    //     if(this._linkRendererDataIndex == this._linkColumnsCount)
    //     {
    //       this._linkRendererDataIndex = 0;
    //     }
    //
    //     let linkIdentifier = linkID+this._linkCounter++;
    //     if(linkInfo.link != undefined) {
    //       let params: string[] = linkInfo.params.split('##');
    //       for(let param of params){
    //         paramValue += "/" + URebalUtil.encodeparams(rowdata[param]);
    //       }
    //
    //       if(paramValue.lastIndexOf("/") != 0){
    //         paramValue = paramValue.slice(0, -1);
    //       }
    //
    //       return `<div style="margin: 4px; line-height: 3; position: relative;"><a href="${linkInfo.link}${paramValue}">${value}</a></div>`;
    //     } else if(linkInfo.click != undefined){
    //       let linkInformation = new GridLinkInfo();
    //       linkInformation.linkType = linkInfo.click;
    //       for(let param of linkInfo.params){
    //         linkInformation.linkParams[param] = rowdata[param];
    //       }
    //       this.bindLinkEvent(linkIdentifier, linkInformation);
    //
    //       return `<div style="margin: 4px; line-height: 3; position: relative;"><a href="javascript: void(0);" id='${linkIdentifier}' >${value}</a></div>`;
    //     }
    //
    //   } else{
    //     console.log("Please specify linkRendererParams=[{link: router link, params: string[]}] e.g. [{link:/workspaces/list, params:[portfolioname]}]");
    //   }
    // };

    linkRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {

        let renderedLink: string = this.LinkBinder(rowdata, value, columnproperties); // this LinkBinder Method needs to execute first before returning any renderedlink.

        /** === check grid linkRenderer permissions === **/
        if (this.linkRendererPermissions != undefined && !this.checkLinkRendererPermissions(columnfield, rowdata)) {
            renderedLink =
                `<div style="margin-top: 10px; margin-left: 4px; position: relative; overflow: hidden; text-overflow: ellipsis;">${value}</div>`;
        }
        /** ========================================== **/

        return renderedLink;
    };

    handleLinkClick = (event: any) => {
        let linkId = event.target.id;

        if (this._LinkMap[linkId]) {
            this.component.fireClickEvent(this._LinkMap[linkId]);
        }

    }

    bindLinkEvent = (linkID: string, linkInfo: GridLinkInfo) => {
        // save linkID and action for registering events
        $('body').on('click', '#' + linkID, this.handleLinkClick);
        this._LinkMap[linkID] = linkInfo;
    }

    cellsRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {

        let modifyValue: any = value;

        let columns: any = typeof this.component.dataColumns == "string" ? JSON.parse(this.component.dataColumns) :
            this.component.dataColumns;

        let dataType = "string";
        for (let column of columns) {
            if (column.name === columnfield) {
                dataType = column.type;
                break;
            }
        }

        if (dataType === "number") {

            if (typeof value === 'number') {
                // If user provided cellsFormat is present then use it, otherwise use default format of integer
                modifyValue = this.jqxFormatter.formatnumber(value,
                    columnproperties.cellsformat ?
                        (columnproperties.cellsformat != "" ? columnproperties.cellsformat : numberFormat)
                        : numberFormat);
                if (this.negativeValueColumns != undefined) {
                    if (this.negativeValueColumns instanceof Array) {
                        for (let columnIndex = 0; columnIndex < this.negativeValueColumns.length; columnIndex++) {
                            if (columnfield === this.negativeValueColumns[columnIndex].column) {
                                if (modifyValue.charAt(1) === '-') {
                                    modifyValue = '(' + modifyValue.replace('-', '') + ')'
                                }
                            }
                        }
                    }
                }
            } else {
                modifyValue = '--'
            }


        } else if (dataType == "date") {
            let printDate = new Date(value);
            if (isNaN(printDate.getDay()) || isNaN(printDate.getMonth()) || isNaN(printDate.getFullYear())) {
                // invalid date
                modifyValue = "--";
            } else {
                // use format provided in cellsformat attribute otherwise use default format
                modifyValue = this.jqxFormatter.formatdate(printDate, columnproperties.cellsformat ?
                    (columnproperties.cellsformat != "" ? columnproperties.cellsformat : dateFormat)
                    : dateFormat);
            }
        } else if (dataType == "boolean") {
            if (value === true) {
                modifyValue = "Yes";
            } else {
                modifyValue = "No";
            }
        }

        let rowRendered = this.rowRenderer(rowdata, modifyValue, columnproperties);
        if (rowRendered != undefined) {
            return rowRendered;
        } else {


            if (this._customTooltipParam != undefined && this._customTooltipParam[columnfield] != undefined) {
                return '<div title=\"' + rowdata[this._customTooltipParam[columnfield]] + '\" style="overflow: hidden; margin-top: 10px;  padding-' + columnproperties.cellsalign + ': 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ' + columnproperties.cellsalign + ';">' + this.stringFormatter(
                    modifyValue) + '</div>';
            } else
                return '<div style="overflow: hidden; margin-top: 10px;  padding-' + columnproperties.cellsalign + ': 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ' + columnproperties.cellsalign + ';">' + this.stringFormatter(
                    modifyValue) + '</div>';
        }
    };

    LinkBinder(rowdata, htmlText, columnproperties?) {

        if (this.linkRendererParams != undefined) {

      let parseLinkAndParams = typeof this.linkRendererParams == "string" ? JSON.parse(this.linkRendererParams) : this.linkRendererParams;

            if (!(parseLinkAndParams instanceof Array)) {
                console.log("Error: linkRendererParams should be an array.");
                return;
            }

            if (this.linkColumnsCount != parseLinkAndParams.length) {
                console.log("Error: linkRendererParams not provided for all columns having linkRenderer.");
                return;
            }

            let paramValue: string = "";
            let linkID = this.gridId + '-link-';
            let linkInfo = parseLinkAndParams[this._linkRendererDataIndex++];
            if (this._linkRendererDataIndex == this._linkColumnsCount) {
                this._linkRendererDataIndex = 0;
            }

            let linkIdentifier = linkID + this._linkCounter++;
            let linkCellValue: string = '';
            if (linkInfo.link != undefined) {
                let params: string[] = linkInfo.params.split('##');
                for (let param of params) {
                    paramValue += "/" + URebalUtil.encodeparams(rowdata[param]);
                }

                if (paramValue.lastIndexOf("/") != 0) {
                    paramValue = paramValue.slice(0, -1);
                }

                linkCellValue =
                    `<div style="margin-top: 10px; margin-left: 4px; position: relative; overflow: hidden; text-overflow: ellipsis;"><a href="${linkInfo.link}${paramValue}">${htmlText}</a></div>`;
            } else if (linkInfo.click != undefined) {
                let linkInformation = new GridLinkInfo();
                linkInformation.linkType = linkInfo.click;
                for (let param of linkInfo.params) {
                    linkInformation.linkParams[param] = rowdata[param];
                }
                this.bindLinkEvent(linkIdentifier, linkInformation);

                let cellalign = columnproperties ? columnproperties.cellsalign : 'left';
                linkCellValue =
                    `<div style="margin-top: 10px; margin-left: 4px; position: relative; overflow: hidden; text-overflow: ellipsis; text-align: ` + cellalign + `;"><a href="javascript: void(0);" id='${linkIdentifier}' >${htmlText}</a></div>`;
            }

            if (htmlText == '') {
                linkCellValue =
                    `<div style="margin-top: 10px; margin-left: 4px; position: relative; overflow: hidden; text-overflow: ellipsis;">--</div>`;
            }

            return linkCellValue;

        } else {
            console.log(
                "Please specify linkRendererParams=[{link: router link, params: string[]}] e.g. [{link:/workspaces/list, params:[portfolioname]}]");
        }
        return `<div style="margin-top: 10px; margin-left: 4px; position: relative; overflow: hidden; text-overflow: ellipsis;"><a>${htmlText}</a></div>`;
    }


    createWidget = (row: any, column: any, value: string, htmlElement: HTMLElement): void => {
    }
    actionRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {

        let timestamp = new Date();

        let ulContainer = document.createElement('div');
        ulContainer.className = `slds-dropdown slds-dropdown_right slds-nubbin--top-left`;

        if (this.actionItems != undefined) {

            let parseActionItems: any[] = JSON.parse(this.actionItems);

            if (!(parseActionItems instanceof Array)) {
                console.log("Error: actionItems should be an array.");
                return;
            }

            /** === check grid actionItems permissions === **/
            if (this.actionItemsPermissions != undefined) {
                parseActionItems = this.checkActionItemsPermissions(parseActionItems, rowdata);
            }
            /** ===================================== **/

            let paramValue: string = "";
            let linkID = this.gridId + '-action-link-' + this._linkCounter++;
            let dropdownId = "dropdown-" + Math.round(Math.random() * timestamp.getTime());
            let actionItemsCounter = 0;
            let actionsItemList = `<div class="slds-dropdown slds-dropdown--left slds-nubbin--top-left gridActionDropdown" id="${dropdownId}"><ul class="slds-dropdown__list" role="menu">`;

            for (let actionItem of parseActionItems) {
                /*
                Need to apply style on any individual element {style:"color:#b3b4b5"}
                 */
                let style: string = "";
                if (actionItem.style != undefined) {
                    style = actionItem.style;
                }


                if (actionItem.link != undefined) {
                    let params: string[] = actionItem.params.split('##');
                    for (let param of params) {
                        paramValue += "/" + URebalUtil.encodeparams(rowdata[param]);
                    }

                    if (paramValue.lastIndexOf("/") != 0) {
                        paramValue = paramValue.slice(0, -1);
                    }

                    actionsItemList += `<li class="slds-dropdown__item" role="presentation">
                          <a href="${actionItem.link}${paramValue}" role="menuitem" tabindex="0" style="${style}">${actionItem.item}
                          </a>
                      </li> `

                } else if (actionItem.click != undefined) {

                    let linkInformation = new GridLinkInfo();
                    linkInformation.linkType = actionItem.click;
                    for (let param of actionItem.params) {
                        linkInformation.linkParams[param] = rowdata[param];
                    }

                    let linkIdentifier = linkID + this._widgetCounter + "" + actionItemsCounter++;
                    this.bindLinkEvent(linkIdentifier, linkInformation);

                    actionsItemList += `<li class="slds-dropdown__item" role="presentation">
                          <a id='${linkIdentifier}' href="javascript:void(0);" role="menuitem" tabindex="0" style="${style}">${actionItem.item}
                          </a>
                      </li> `
                }
            }

            actionsItemList += `</ul></div>`;

            let container = document.createElement('div');
            let id = `myButton${this._widgetCounter + Math.round(Math.random() * timestamp.getTime())}`;
            container.className = `slds-dropdown-trigger`;
            container.innerHTML = `<button id="${id}" class="slds-button slds-button--icon-container bl-actions-dropdown" aria-haspopup="false" title="Action" >
                            <img src="${this.appContext}/assets/images/blueleaf/icon-gear.svg" aria-hidden="true">
              </button>`;
            //container.innerHTML += actionsItemList;

            let parentContainer = document.createElement('div');
            parentContainer.className = `slds-button-group`;
            parentContainer.setAttribute("role", "group");

            let mainContainer = document.createElement('div');

            mainContainer.setAttribute("position", "relative");

            mainContainer.appendChild(container);
            parentContainer.appendChild(mainContainer);


            this.bindActionButtonEvent(id, actionsItemList, dropdownId);

            return parentContainer.innerHTML;


        } else {
            console.log(
                "Please specify linkRendererParams=[{link: router link, params: string[]}] e.g. [{link:/workspaces/list, params:[portfolioname]}]");
        }

        this._widgetCounter++;
    }

    checkActionItemsPermissions(actionItems: any[], rowdata: any): any[] {
        let actionItemsPermissionsCollection: any[] = JSON.parse(this.actionItemsPermissions);

        if (!(actionItemsPermissionsCollection instanceof Array)) {
            console.log("Error: parseActionItemsPermissions should be an array.");
            return;
        }

        for (let i = 0; i < actionItemsPermissionsCollection.length; i++) {
            let itemIdx = actionItems.findIndex(action => action.item === actionItemsPermissionsCollection[i].item);

            if (actionItemsPermissionsCollection[i].checkParamPermission === true) {
                // need to check param value permission here

                let permissionIndex = actionItemsPermissionsCollection[i].paramValuePermissions.findIndex(
                    p => p.paramValue === String(rowdata[actionItemsPermissionsCollection[i].paramName]));
                let permissionName: string = "";
                if (permissionIndex > -1) {
                    permissionName =
                        actionItemsPermissionsCollection[i].paramValuePermissions[permissionIndex].permissionName; // get permission name from route path "parameter"
                }
                if (itemIdx > -1 && !this.urebalPermissions.isAllowed(permissionName)) {
                    actionItems.splice(itemIdx, 1);
                }
            } else if (actionItemsPermissionsCollection[i].permissionName != undefined) {
                if (itemIdx > -1 && !this.urebalPermissions.isAllowed(
                    actionItemsPermissionsCollection[i].permissionName)) {
                    actionItems.splice(itemIdx, 1);
                }
            }
        }

        return actionItems;
    }

  checkLinkRendererPermissions(columnField: string, rowdata: any) : boolean {
      let linkRendererPermissionsCollection: any[] = typeof this.linkRendererPermissions == "string" ?
          JSON.parse(this.linkRendererPermissions) : this.linkRendererPermissions;

      if (!(linkRendererPermissionsCollection instanceof Array)) {
          console.log("Error: linkRendererPermissions should be an array.");
          return false;
      }

      let paramPermissionIndex: number = linkRendererPermissionsCollection.findIndex(
          lnk => lnk.datafield === columnField && lnk.checkParamPermission === true);

      if (paramPermissionIndex > -1) {
          let paramName = linkRendererPermissionsCollection[paramPermissionIndex].paramName;
          // need to check param value permission here
          let permissionIndex = linkRendererPermissionsCollection[paramPermissionIndex].paramValuePermissions.findIndex(
              lnk => lnk.paramValue === String(rowdata[paramName]));
          if (permissionIndex > -1) {
              return this.urebalPermissions.isAllowed(
                  linkRendererPermissionsCollection[paramPermissionIndex].paramValuePermissions[permissionIndex].permissionName);
          } else {
              return true;
          }
      } else {
          let permissionIndex = linkRendererPermissionsCollection.findIndex(lnk => lnk.datafield === columnField);
          if (permissionIndex > -1) {
              return this.urebalPermissions.isAllowed(
                  linkRendererPermissionsCollection[permissionIndex].permissionName);
          } else {
              return true;
          }
      }
  }

    initWidget = (row: number, column: any, value: any, htmlElement: HTMLElement): void => {
    }

    showActions(actionCounter) {
        $('#urebal-action-' + actionCounter).on({
            click: function () {
                alert("Hello")
            }
        });
    }

    /**
     ===========================================
     Description: Action menu event handler function.
     Author: Waqas K.
     Dated: 27-07-2018
     Against: Defect # 103
     ===========================================
     */

    bindActionButtonEvent = (id: string, html: any, dId: string) => {

        $('body').on('click', '#' + id, (e) => {
            e.stopPropagation();

            //check if already open then toggle dropdown
            if ($('.gridActionDropdown').attr("id") === dId) {

                //remove all dropdown if exists
                $('.gridActionDropdown').remove();
            } else {
                //append new dropdown
                //remove all dropdown if exists
                $('.gridActionDropdown').remove();
                $('body').append(html);
            }

            //change drop position for last two rows. check the diff from body height and the button position
            let buttonObj = $('#' + id);
            let heightDiff = ($('body').height() - e.clientY);
            if (heightDiff < 150) {
                $('.gridActionDropdown').css({
                    'left': buttonObj.offset().left - (buttonObj.width() / 2) + 6,
                    'top': buttonObj.offset().top - ($('.gridActionDropdown').height() + 20)
                });
                $('.gridActionDropdown').removeClass('slds-nubbin--top-left').addClass('slds-nubbin--bottom-left');
            } else {
                $('.gridActionDropdown').removeClass('slds-nubbin--bottom-left').addClass('slds-nubbin--top-left');
                $('.gridActionDropdown').css({
                    'left': buttonObj.offset().left - (buttonObj.width() / 2) + 5,
                    'top': buttonObj.offset().top + 32
                });
            }

            //Remove dropdown from DOM when click anywhere outside the dropdown
            $(document).on('click', () => {
                $('.gridActionDropdown').remove();
            });

        });
    }
    /** End bindActionButtonEvent */

    imageRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
        if (value) {
            return `<div style='width: 100%; height: 100%;' title='Invalid'><img src="${this.appContext}/assets/images/warning_icon.png" class="circularError"></img></div>`;

        } else {
            return `<div style='width: 100%; height: 100%;' title='Valid'><img src="${this.appContext}/assets/images/blueleaf/icon-check.svg" class="circularError"></img></div>`;
            //   if(rowdata.url){
            //   return `<div>
            //   <div class="slds-button__icon">
            //   `+rowdata.url+`
            //   </div>
            //   </div>`;
            //   }
            //   return `<div> </div>`;
        }
    };

    typeRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
        let output = "";

        if (value) {
            output +=
                `<div style='width: 100%; height: 100%;' title='Household'><img class='account-list-icon' src='${this.appContext}/assets/images/household.png'></div>`;
        } else {
            output +=
                `<div style='width: 100%; height: 100%;' title='Account'><img class='account-list-icon' src='${this.appContext}/assets/images/single.png'></div>`;
        }

        return output;

    };

    rowRenderer(rowdata, value, columnproperties): any {
        if (this.rowRendererColumns != undefined) {
            for (let renderRow of this.rowRendererColumns) {
                if (rowdata[renderRow.name] != undefined) {
                    /**
                     * Checking column(s) value type
                     */
                    if (typeof (rowdata[renderRow.name]) === "string") {
                        if (rowdata[renderRow.name] === renderRow.value) {
                            return '<div style="overflow: hidden; margin-top: 10px;  padding-' + columnproperties.cellsalign + ': 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ' + columnproperties.cellsalign + '; color: ' + renderRow.color + '!important;">' + this.stringFormatter(
                                value) + '</div>';
                        }
                    } else if (typeof (rowdata[renderRow.name]) === "number") {
                        if (renderRow.condition != undefined) {
                            if (renderRow.condition === 'lt') {
                                if (rowdata[renderRow.name] < renderRow.value) {
                                    return '<div style="overflow: hidden; margin-top: 10px; padding-' + columnproperties.cellsalign + ': 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ' + columnproperties.cellsalign + '; color: ' + renderRow.color + ';">' + value + '</div>';
                                }
                            } else if (renderRow.condition === 'gt') {
                                if (rowdata[renderRow.name] > renderRow.value) {
                                    return '<div style="overflow: hidden; margin-top: 10px;  padding-' + columnproperties.cellsalign + ': 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ' + columnproperties.cellsalign + '; color: ' + renderRow.color + ';">' + value + '</div>';
                                }
                            } else if (renderRow.condition === 'eq') {
                                if (rowdata[renderRow.name] == renderRow.value) {
                                    return '<div style="overflow: hidden; margin-top: 10px;  padding-' + columnproperties.cellsalign + ': 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ' + columnproperties.cellsalign + '; color: ' + renderRow.color + ';">' + value + '</div>';
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}
