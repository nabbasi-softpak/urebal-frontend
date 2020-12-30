import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    ViewRef
} from '@angular/core';
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {UrebalDropdownComponent} from "../../../shared/components/urebal-dropdown/urebal-dropdown.component";
import {UILoader} from "../../../shared/util/UILoader";
import {SecurityService} from "../../security.service";
import {ModelService} from "../../../model/model.service";
import {jqxGridComponent} from "@jqxSource/angular_jqxgrid";
import {PermissionResolverService, UrebalPermissions} from "../../../services/permission-resolver.service";
import {SoftpakGridHelper} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {securityAdvancedSearchGridColsMeta} from "../../../shared/classes/grid-columns.metadata.container";
import {LazyLoadedGrid} from "../../../shared/util/LazyLoadedGrid";


@Component({
    selector: 'security-advanced-search',
    templateUrl: './security-advanced-search.component.html',
    styleUrls: ['./security-advanced-search.component.css'],
})
export class SecurityAdvancedSearchComponent extends UrebalPermissions implements OnInit {

    modalId: string = '';
    selectedIndex: string = '';
    attributesData: any[] = [];

    searchTerm: string = '';
    private selectedAttributes: SecurityFilter[] = [];
    private selectedSecurityTypes: SecurityFilter[] = [];

    private securityTypeId: number = -1;

    private primaryAssetClass: any = [];
    otherAttributes: any[];
    private securityTypes: any = [];

    private fetchedSecurities: any = [];
    private selectedSecurities: any = [];
    private chipArray: any[] = [];

    errMsg: string = '';

    private readonly PAC: string = 'Primary Asset Class';
    private readonly CASH: string = 'CASH';

    dataAdapter: any;
    gridColumns: any;

    @Input() attributeType: string;
    @Input() attribute: string;

    @Output()
    public securitiesSelect: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    @ViewChildren(UrebalDropdownComponent) dropdowns: QueryList<UrebalDropdownComponent>;
    @ViewChildren(ModalComponent) securitySearchModals: QueryList<ModalComponent>;
    @ViewChild('refSecuritySearchGrid', {static: true}) securityGrid: jqxGridComponent;

    @ViewChild('vcChip', {read: ViewContainerRef}) vcChip: ViewContainerRef;
    @ViewChild('tpl') tpl: TemplateRef<any>;

    @ViewChildren('chkbox') checkBoxes: QueryList<ElementRef>;

    public lazyLoadGrid: LazyLoadedGrid<any>;

    constructor(public uRebalPermissionResolver: PermissionResolverService, public securityService: SecurityService,
                private modelService: ModelService,
    ) {
        super(uRebalPermissionResolver);
        this.gridColumns = this.getColumns();
        this.dataAdapter = new jqx.dataAdapter(this.source);
    }

    ngOnInit() {
        this.initializeLazyLoadGrid();
        SoftpakGridHelper.rearrangeGridColumns(this.gridColumns);
        this.toggleFiltersCollapseExpand();

        this.modalId = 'securitySearchModal-' + Math.floor((Math.random() * 100000) + 1);
    }

    ngAfterContentChecked() {
        $(".jqx-checkbox").parent().attr("title", "");
    }

    initializeLazyLoadGrid(){
        this.lazyLoadGrid = new LazyLoadedGrid<any>(this.uRebalPermissionResolver);
        this.lazyLoadGrid.jqxGrid = this.securityGrid;
        this.lazyLoadGrid.keyColumn = 'securityId';
        this.lazyLoadGrid.gridKeyColumn = 'securityId';
    }

    toggleFiltersCollapseExpand(){
        $(document).on('click', '.urebal-collapsible-header', function () {
            var collapsible_body = $(this).next();
            if (collapsible_body.hasClass('ur-is-open')) {
                collapsible_body.removeClass('ur-is-open').hide('fast');
                $(this).find('.caret').removeClass('animate-arrow');
            } else {
                collapsible_body.addClass('ur-is-open ur-is-active').show('fast');
                $(this).find('.caret').addClass('animate-arrow');
            }
        });
    }

    handleMoreFilterClick(event: any) {
        this.selectedIndex = event.target.target;
    }

    initializeData() {
        this.errMsg = '';
        this.getAttributes();
        this.getSecurityTypes();
    }

    getAttributes() {
        this.modelService.getAttributeForSecuritySearch().subscribe(
            result => {
                if (result.code == 200) {
                    this.attributesData = result.responsedata;
                    let index = this.attributesData.findIndex(data => data.attributeType == this.CASH);
                    if (index >= 0) {
                        this.attributesData.splice(index, 1);
                    }
                    //Checking for this permission as this is the only case when attribute data would be unavailable
                    if (this.isAllowed('modelViewAssetModel')) {
                        this.getPrimmaryAssetClassAttributes();
                        this.getOtherAttributes();
                    }

                }
            },
            err => {
                console.error(err);
                UILoader.blockUI.stop();
            }
        );

    }

    getPrimmaryAssetClassAttributes() {
        let pacData = this.attributesData.find(data => data.attributeType == this.PAC);
        this.primaryAssetClass = pacData;

        this.primaryAssetClass.attributes.unshift({
            attributeID: -1,
            attributeName: 'All',
            attributeType: this.primaryAssetClass.attributeType,
            securities: []
        });

        this.bindPrimaryAssetClassAttributes();
        this.selectPrimaryAssetClassAttribute();
    }

    bindPrimaryAssetClassAttributes() {
        this.dropdowns.forEach(dropdownObject => {
            if (dropdownObject.id === "dropdownPrimaryAssetClass") {
                let dropdown = dropdownObject.dropdownList;
                dropdownObject.refreshDropDown(this.primaryAssetClass.attributes);
            }
        });
    }

    selectPrimaryAssetClassAttribute(item?: any): void {
        let dropdown: any;
        this.dropdowns.forEach(dropdownObject => {
            if (dropdownObject.id === "dropdownPrimaryAssetClass") {
                dropdown = dropdownObject.dropdownList;
            }
        });
        if (this.attributeType == this.PAC) {
            let pacAttribute = this.primaryAssetClass.attributes.find(a => a.attributeName == this.attribute);
            dropdown.selectItem(pacAttribute.attributeID);
            dropdown.disabled(true);
            let newItem = {
                id: pacAttribute.attributeID,
                name: this.primaryAssetClass.attributeType + ': ' + pacAttribute.attributeName,
                type: filterType.primaryAssetClass,
                typeId: this.primaryAssetClass.rowNum
            };
            this.addAttributeFilter(newItem);
        } else if (item) {
            let pacAttribute = this.primaryAssetClass.attributes.find(a => a.attributeID == item.value);
            let filter = this.selectedAttributes.find(i => i.typeId == this.primaryAssetClass.rowNum);
            if (filter) {
                this.removeAttributeFilter(filter);
            }
            dropdown.selectItem(pacAttribute.attributeID);
            let selectedItem = {
                id: pacAttribute.attributeID,
                name: this.primaryAssetClass.attributeType + ': ' + pacAttribute.attributeName,
                type: filterType.primaryAssetClass,
                typeId: this.primaryAssetClass.rowNum
            };
            this.addAttributeFilter(selectedItem);
        } else {
            let pacAttributeAll = this.primaryAssetClass.attributes.find(a => a.attributeID == -1);
            dropdown.selectItem(pacAttributeAll.attributeID);
            let selectedItem = {
                id: pacAttributeAll.attributeID,
                name: this.primaryAssetClass.attributeType + ': ' + pacAttributeAll.attributeName,
                type: filterType.primaryAssetClass,
                typeId: this.primaryAssetClass.rowNum
            };
            this.addAttributeFilter(selectedItem);
        }
    }

    selectOtherAttribute(event, attribute, attributeType): void {
        if (this.attributeType == attributeType.attributeType) {
            let attributes = attributeType.attributes;
            this.selectedIndex = 'f-' + attributeType.rowNum;
            attributes.forEach(attr => {
                let checkbox = this.checkBoxes.find(chk => chk.nativeElement.id == 'chk1-' + attr.attributeID);
                if (checkbox.nativeElement.id == 'chk1-' + attribute.attributeID) {
                    checkbox.nativeElement.checked = true;
                    let defaultItem = {
                        id: attribute.attributeID,
                        name: attributeType.attributeType + ': ' + attribute.attributeName,
                        type: filterType.other,
                        typeId: attributeType.rowNum
                    };
                    this.addAttributeFilter(defaultItem);
                }
                checkbox.nativeElement.disabled = true;
            });
        } else {
            let item = {
                id: attribute.attributeID,
                name: attributeType.attributeType + ': ' + attribute.attributeName,
                type: filterType.other,
                typeId: attributeType.rowNum
            };
            let chkBox = event.target;
            if (chkBox) {
                if (chkBox.checked) {
                    this.addAttributeFilter(item);
                } else {
                    this.removeAttributeFilter(item);
                }

                if (this.isAllAtributesSelectedForType(attributeType.rowNum)) {
                    let otherTypeSelected = this.selectedAttributes.filter(a => a.typeId == attributeType.rowNum);
                    otherTypeSelected.forEach(attr => {
                        this.removeChip(attr);
                    });
                    let item = {
                        id: -1,
                        name: attributeType.attributeType + ': All',
                        type: filterType.other,
                        typeId: attributeType.rowNum
                    };
                    this.addAttributeFilter(item);
                } else {
                    let otherTypeAll = this.selectedAttributes.filter(
                        a => a.typeId == attributeType.rowNum && a.id == -1);
                    if (otherTypeAll.length > 0) {
                        this.removeAttributeFilter(otherTypeAll[0]);
                        let otherTypeSelected = this.selectedAttributes.filter(
                            a => a.typeId == attributeType.rowNum && a.id != -1);
                        if (otherTypeSelected) {
                            otherTypeSelected.forEach(attr => {
                                this.addChip(attr);
                            });
                        }
                    }
                }
            }
        }

    }

    isAllAtributesSelectedForType(attributeTypeId) {
        let otherType = this.otherAttributes.find(a => a.rowNum == attributeTypeId);
        let otherTypeSelected = this.selectedAttributes.filter(a => a.typeId == attributeTypeId && a.id != -1);
        if (otherType && otherTypeSelected) {
            return (otherType.attributes.length == otherTypeSelected.length);
        }

        return false;
    }

    getOtherAttributes() {
        this.otherAttributes = this.attributesData.filter(data => data.attributeType != this.PAC);
        let otherType = this.otherAttributes.find(a => a.attributeType == this.attributeType);
        if (otherType) {
            let defaultAttribute = otherType.attributes.find(a => a.attributeName == this.attribute);
            if (defaultAttribute) {
                UILoader.blockUI.start();
                setTimeout(() => {
                    this.selectOtherAttribute(null, defaultAttribute, otherType);
                    UILoader.blockUI.stop();
                }, 1000);
            }
        }
    }

    getSecurityTypes() {
        this.securityService.getSecurityTypes().subscribe(
            result => {
                if (result.code == 200) {
                    this.securityTypes = result.responsedata;
                    if(this.securityTypes && Array.isArray(this.securityTypes)){
                        this.securityTypes = this.securityTypes.sort();
                    }
                    this.securityTypes.unshift('All');

                    this.securityTypeId = -1;
                    this.bindSecurityType();
                    this.selectSecurityType();
                }
            },
            err => {
                console.error(err);
                UILoader.blockUI.stop();
            }
        );
    }

    bindSecurityType() {
        this.dropdowns.forEach(dropdownObject => {
            if (dropdownObject.id === "dropdownSecurityType") {
                let dropdown = dropdownObject.dropdownList;
                dropdownObject.refreshDropDown(this.securityTypes);
            }
        });
    }

    selectSecurityType(item?: any) {
        let dropdown: any;
        this.dropdowns.forEach(dropdownObject => {
            if (dropdownObject.id === "dropdownSecurityType") {
                dropdown = dropdownObject.dropdownList;
            }
        });
        if (item) {
            let filter = this.selectedSecurityTypes.find(i => i.typeId == this.securityTypeId);
            if (filter) {
                this.removeSecurityFilter(filter);
            }
            let securityTypeIndex = this.securityTypes.indexOf(item.value);
            let securityType = this.securityTypes[securityTypeIndex];
            dropdown.selectItem(securityType);
            let selectedItem = {
                id: securityType,
                name: 'Security Type: ' + securityType,
                type: filterType.securityType,
                typeId: this.securityTypeId
            };
            this.addSecurityFilter(selectedItem);
        } else {
            let idx = this.securityTypes.findIndex(a => a == 'All');
            let itemAll = this.securityTypes[idx];
            dropdown.selectItem(itemAll);
            let selectedItem = {
                id: itemAll,
                name: 'Security Type: ' + itemAll,
                type: filterType.securityType,
                typeId: this.securityTypeId
            };
            this.addSecurityFilter(selectedItem);
        }
    }

    addChip(item) {
        let index = this.chipArray.findIndex(i => i.id == item.id && i.typeId == item.typeId);
        if (index > -1) {
            return;
        }

        if (item.type == filterType.primaryAssetClass) {
            this.vcChip.createEmbeddedView(this.tpl,
                {'filter': {id: item.id, name: item.name, type: item.type, typeId: item.typeId}});
        } else if (item.type == filterType.securityType) {
            this.vcChip.createEmbeddedView(this.tpl,
                {'filter': {id: item.id, name: item.name, type: item.type, typeId: item.typeId}});
        } else {
            let viewRef: ViewRef = this.vcChip.createEmbeddedView(this.tpl,
                {'filter': {id: item.id, name: item.name, type: item.type, typeId: item.typeId}});
            let viewRefIndex = this.vcChip.indexOf(viewRef);
            //chip array {index: viewRefIndex , typeId: item.typeId}
            //item.index = viewRefIndex;
        }
        this.chipArray.push(item);

        this.rearrangeChips();
    }

    removeChip(item) {
        let index = this.chipArray.findIndex(i => i.id == item.id && i.typeId == item.typeId);
        if (index > -1) {
            this.chipArray.splice(index, 1);

            this.vcChip.remove(index);
            this.rearrangeChips();
        }
    }

    rearrangeChips() {
        this.chipArray.sort(function (a, b) {
            return a.type - b.type || a.typeId - b.typeId || a.id - b.id;
        });

        this.vcChip.clear();

        for (let i = 0; i < this.chipArray.length; i++) {
            this.vcChip.createEmbeddedView(this.tpl, {
                'filter': {
                    id: this.chipArray[i].id,
                    name: this.chipArray[i].name,
                    type: this.chipArray[i].type,
                    typeId: this.chipArray[i].typeId
                }
            }, i);
        }
    }

    genenerateSearchCriteria(): string {
        let criteriaString: string = '';

        //securityName=asdf%20psdff&securityTypes=Fixed%20Income&securityTypes=Equity&attributesList=123&attributesList=130&attributesList=1234

        criteriaString = 'securityName=' + encodeURIComponent(this.searchTerm.trim()) + '&';

        this.selectedSecurityTypes.forEach(securitytype => {
            if (securitytype.id == 'All') {
                let securityTypeIndex = this.securityTypes.indexOf(securitytype.id);
                if (securityTypeIndex >= 0) {
                    this.securityTypes.forEach(sectype => {
                        if (sectype != 'All') {
                            criteriaString += 'securityTypes=' + encodeURIComponent(sectype) + '&';
                        }
                    });
                }
            } else {
                criteriaString += 'securityTypes=' + encodeURIComponent(securitytype.id) + '&';
            }
        });

        this.selectedAttributes.forEach(attr => {
            if (attr.id == -1) {
                if (attr.type == filterType.primaryAssetClass) {
                    let attrType = this.attributesData.find(data => data.rowNum == attr.typeId);
                    if (attrType) {
                        attrType.attributes.forEach(attr1 => {
                            if (attr1.attributeID != -1) {
                                criteriaString += 'attributesList=' + attr1.attributeID + '&';
                            }
                        });
                    }
                }
            } else {
                criteriaString += 'attributesList=' + attr.id + '&';
            }
        });

        return criteriaString.slice(0, -1);
    }

    searchSecurities() {

        this.errMsg = '';

        this.securityGrid.clearselection();
        this.lazyLoadGrid.resetRowsSelection();
        this.selectedSecurities = [];
        this.fetchedSecurities = [];

        UILoader.blockUI.start();
        this.securityService.fetchSecuritiesByCriteria(this.genenerateSearchCriteria()).subscribe(
            result => {
                if (result.code == 200) {
                    this.fetchedSecurities = result.responsedata;
                    this.source.localdata = this.fetchedSecurities;
                    this.securityGrid.updatebounddata();
                    this.securityGrid.ready();
                    UILoader.blockUI.stop();
                } else {
                    this.fetchedSecurities = [];
                    this.source.localdata = this.fetchedSecurities;
                    this.securityGrid.updatebounddata();
                    this.securityGrid.ready();
                    let localizationObj = {};
                    localizationObj['emptydatastring'] = "";
                    this.securityGrid.localizestrings(localizationObj);
                    UILoader.blockUI.stop();
                }
            },
            err => {
                this.fetchedSecurities = [];
                this.source.localdata = this.fetchedSecurities;
                this.securityGrid.updatebounddata();
                this.securityGrid.ready();
                let localizationObj = {};
                localizationObj['emptydatastring'] = "";
                this.securityGrid.localizestrings(localizationObj);
                UILoader.blockUI.stop();
                console.error(err);
            }
        );
        console.log(this.genenerateSearchCriteria());

    }

    deselectFilter(filter) {
        if (filter.type == filterType.primaryAssetClass) {
            if (this.attributeType == this.PAC && filter.name.replace(this.PAC + ': ', '') == this.attribute) {
                return false;
            }
            this.dropdowns.forEach(dropdownObject => {
                if (dropdownObject.id === "dropdownPrimaryAssetClass") {
                    let dropdown = dropdownObject.dropdownList;
                    this.removeAttributeFilter(filter);
                    let pacAttributeAll = this.primaryAssetClass.attributes.find(a => a.attributeID == -1);
                    dropdown.selectItem(pacAttributeAll.attributeID);
                    let selectedItem = {
                        id: pacAttributeAll.attributeID,
                        name: this.primaryAssetClass.attributeType + ': ' + pacAttributeAll.attributeName,
                        type: filterType.primaryAssetClass,
                        typeId: this.primaryAssetClass.rowNum
                    };
                    this.addAttributeFilter(selectedItem);
                }
            });
        } else if (filter.type == filterType.securityType) {
            this.dropdowns.forEach(dropdownObject => {
                if (dropdownObject.id === "dropdownSecurityType") {
                    let dropdown = dropdownObject.dropdownList;
                    this.removeSecurityFilter(filter);
                    let idx = this.securityTypes.findIndex(a => a == 'All');
                    let itemAll = this.securityTypes[idx];
                    dropdown.selectItem(itemAll);
                    let selectedItem = {
                        id: itemAll,
                        name: 'Security Type: ' + itemAll,
                        type: filterType.securityType,
                        typeId: this.securityTypeId
                    };
                    this.addSecurityFilter(selectedItem);
                }
            });
        } else {
            let otherType = this.otherAttributes.find(a => a.attributeType == this.attributeType);
            if (otherType && otherType.rowNum == filter.typeId) {
                return false;
            }
            if (this.isAllAtributesSelectedForType(filter.typeId)) {
                let typeAttributes = this.selectedAttributes.filter(i => i.typeId == filter.typeId);
                typeAttributes.forEach(attr => {
                    this.removeAttributeFilter(attr);
                    let checkbox = this.checkBoxes.find(chk => chk.nativeElement.id == 'chk1-' + attr.id);
                    if (checkbox) {
                        checkbox.nativeElement.checked = false;
                    }
                });
            } else {
                let checkbox = this.checkBoxes.find(chk => chk.nativeElement.id == 'chk1-' + filter.id).nativeElement;
                if (checkbox) {
                    checkbox.checked = false;
                    this.removeAttributeFilter(filter);
                }
            }
        }
    }

    addAttributeFilter(item) {
        this.addChip(item);

        let filter = this.selectedAttributes.find(i => i.typeId == item.typeId && i.id == item.id);
        if (!filter) {
            let attributeFilter: SecurityFilter = {id: item.id, name: item.name, type: item.type, typeId: item.typeId};
            this.selectedAttributes.push(attributeFilter);
        }
    }

    removeAttributeFilter(item) {
        this.removeChip(item);

        let filterIndex = this.selectedAttributes.findIndex(i => i.id == item.id && i.typeId == item.typeId);
        if (filterIndex > -1) {
            this.selectedAttributes.splice(filterIndex, 1);
        }
    }

    addSecurityFilter(item) {
        this.addChip(item);

        let filter = this.selectedSecurityTypes.find(i => i.typeId == item.typeId && i.id == item.id);
        if (!filter) {
            let securityTypeFilter: SecurityFilter = {
                id: item.id,
                name: item.name,
                type: item.type,
                typeId: item.typeId
            };
            this.selectedSecurityTypes.push(securityTypeFilter);
        }
    }

    removeSecurityFilter(item) {
        this.removeChip(item);

        let filterIndex = this.selectedSecurityTypes.findIndex(i => i.id == item.id && i.typeId == item.typeId);
        if (filterIndex > -1) {
            this.selectedSecurityTypes.splice(filterIndex, 1);
        }
    }

    checkPriceEmptyInSelectedSecurities() {
        if (this.selectedSecurities.length == 0) {
            this.errMsg = 'Please select securities';
        } else {
            let priceEmpty: boolean = false;
            for (let i = 0; i < this.selectedSecurities.length; i++) {
                if (!this.selectedSecurities[i].price) {
                    priceEmpty = true;
                    break;
                }
            }

            if (priceEmpty) {
                this.closeModal(this.modalId);
                this.openModal('w-' + this.modalId);
            } else {
                this.addSecurities();
            }
        }
    }

    addSecurities() {
        this.securitiesSelect.emit(this.selectedSecurities);
        this.cancelAppliedSecurities();
    }

    selectSecurity(event: any) {
        this.errMsg = '';
        this.lazyLoadGrid.rowSelectGrid(event);
        this.selectedSecurities = Object.assign([], this.lazyLoadGrid.selectedRows);
    }

    unSelectSecurity(event: any) {
        this.lazyLoadGrid.rowUnSelectGrid(event);
        this.selectedSecurities = Object.assign([], this.lazyLoadGrid.selectedRows);
    }

    openModal(id) {
        let instance = this.securitySearchModals.toArray().find(modal => modal.id == id);
        if (instance != null && instance != undefined) {
            instance.open();
        }
    }

    closeModal(id) {
        let instance = this.securitySearchModals.toArray().find(modal => modal.id == id);
        if (instance != null && instance != undefined) {
            instance.close();
        }
    }

    rowReady = (): void => {
    }

    source: any =
      {
        dataType: "json",
        dataFields: [
          { "name": "securityId", "type": "string" },
          { "name": "securityName", "type": "string" },
          { "name": "price", "type": "number" },
          { "name": "marketValue", "type": "number" },
          { "name": "primaryAssetClass", "type": "string" },
          { "name": "securityType", "type": "string" },
          { "name": "sector", "type": "string" },
          { "name": "size", "type": "string"},
          { "name": "style", "type": "string" }
        ],
        localdata: null
      };

    cellsrenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        if (!value) {
            return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}; padding-right: 5px;">${'--'}</div>`;
        }
    };

    getColumns() {
        let data = [
            {
                text: "Name",
                datafield: "securityName",
                width: "17%",
                align: "center",
                cellsalign: "left",
                cellsrenderer: this.cellsrenderer
            },
            {
                text: "Security ID",
                datafield: "securityId",
                width: "12%",
                align: "center",
                cellsalign: "left",
                cellsrenderer: this.cellsrenderer
            },
            {
                text: "Price (USD)",
                datafield: "price",
                width: "12%",
                cellsformat: "d2",
                align: "center",
                cellsalign: "right",
                cellsrenderer: this.cellsrenderer
            },
            {
                text: "Market Value (USD)",
                datafield: "marketValue",
                width: "12%",
                cellsformat: "d2",
                align: "center",
                cellsalign: "right",
                cellsrenderer: this.cellsrenderer
            },
            {
                text: "Primary Asset Class",
                datafield: "primaryAssetClass",
                width: "12%",
                align: "center",
                cellsalign: "left",
                cellsrenderer: this.cellsrenderer
            },
            {
                text: "Security Type",
                datafield: "securityType",
                width: "8%",
                align: "center",
                cellsalign: "left",
                cellsrenderer: this.cellsrenderer
            },
            {
                text: "Sector",
                datafield: "sector",
                width: "8%",
                align: "center",
                cellsalign: "left",
                cellsrenderer: this.cellsrenderer
            },
            {
                text: "Size",
                datafield: "size",
                width: "8%",
                align: "center",
                cellsalign: "left",
                cellsrenderer: this.cellsrenderer
            }
            ,
            {
                text: "Style",
                datafield: "style",
                align: "center",
                cellsalign: "left",
                resizable: false,
                width: "8%",
                cellsrenderer: this.cellsrenderer
            }
        ];

        SoftpakGridHelper.mergeGridColumnProperties(data, securityAdvancedSearchGridColsMeta);

        return data;
    }

    resetSecurityGrid() {
        this.lazyLoadGrid.resetRowsSelection();
        this.selectedSecurities = [];
        this.fetchedSecurities = [];

        this.securityGrid.clearselection();

        this.source.localdata = this.fetchedSecurities;
        this.securityGrid.updatebounddata();
        this.securityGrid.ready();

    }

    resetAppliedFilters() {
        this.chipArray = [];
        this.vcChip.clear();

        this.searchTerm = '';
        this.selectedAttributes = [];
        this.selectedSecurityTypes = [];
        this.otherAttributes = [];

        this.primaryAssetClass = [];
        this.securityTypes = [];
        this.selectedIndex = '';
    }

    cancelAppliedSecurities() {
        this.resetAppliedFilters();
        this.resetSecurityGrid();
        this.closeModal(this.modalId);
    }

}

enum filterType {
    primaryAssetClass = 1,
    securityType = 2,
    other = 3
}

export class SecurityFilter {
    id: any;
    name: string;
    type: filterType;
    typeId: number;
}
