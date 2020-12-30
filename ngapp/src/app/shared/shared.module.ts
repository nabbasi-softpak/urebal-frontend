import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ModalComponent} from './components/modal/modal.component';
import {UrebalGridComponent} from './components/urebal-grid/urebal-grid.component';
import {UrebalDropdownComponent} from './components/urebal-dropdown/urebal-dropdown.component';
import {UrebalAutocompleteComponent} from './components/urebal-autocomplete/urebal-autocomplete.component';
import {AutocompleteComponent} from './components/autocomplete/autocomplete.component';
import {ToggleButtonComponent} from './components/toggle-button/toggle-button.component';
import {ExpandableSettingsComponent} from './components/expandable-settings/expandable-settings.component';
import {URebalTreeGridComponent} from "./components/urebal-tree-grid/urebal-tree-grid.component";
import {URebalAccountTreeGridComponent} from "./components/urebal-account-tree-grid/urebal-account-tree-grid.component";

import {DollarFormatterPipe, PercentFormatterPipe, NumberFormatterPipe} from './pipes/NumericFormatterPipe';
import {PercentageDirective} from './directives/Percentage.directive';
import {NextInputDirective} from './directives/FocusNextInput.directive';

import {jqxGridComponent} from '@jqxSource/angular_jqxgrid';
import {jqxTreeGridComponent} from '@jqxSource/angular_jqxtreegrid';
import {jqxChartComponent} from '@jqxSource/angular_jqxchart';
import {NumberFormatterDirective} from "./directives/NumberFormatter.directive";
import {NumberBoundedFormatterDirective} from "./directives/NumberBoundedFormatter.directive";
import {UpperCaseDirective} from "./directives/Uppercase.directive";
import {SecurityComponent} from './components/autocomplete/security/security.component';
import {AlertsComponent} from './components/alerts/alerts.component';
import {KeysPipe} from './pipes/keys.pipe';
import {MinusSignToParensPipe} from './pipes/MinusSignToParens.pipe';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {SecurityAndModelComponent} from './components/autocomplete/security-and-model/security-and-model.component';
import {DefaultComponent} from './components/autocomplete/default/default.component';
import {ForbiddenAccessComponent} from './components/forbidden-access/forbidden-access.component';
import {UrebalTopBarComponent} from './components/urebal-topbar/urebal-topbar.component';
import {Permissions} from '../../Permissions';
import {PortfolioComponent} from './components/autocomplete/portfolio/portfolio.component';
import {AccountComponent} from './components/autocomplete/account/account.component';
import {AccountSummaryComponent} from './components/account-summary/account-summary.component';
import {DriftedAccountComponent} from './components/autocomplete/drifted-account/drifted-account.component';
import {NumberOfDaysDirective} from './directives/NumberOfDays.directive';
import {EquivalenceComponent} from './components/autocomplete/equivalence/equivalence.component';
import {ModelComponent} from './components/autocomplete/model/model.component';
import {UrebalSidebarComponent} from './components/urebal-sidebar/urebal-sidebar.component';
import {UrebalAccordionGroupComponent} from './components/urebal-accordion-group/urebal-accordion-group.component';
import {UrebalAccordionComponent} from './components/urebal-accordion/urebal-accordion.component';

import {MessageModalComponent} from './components/message-modal/message-modal.component';
import {DialogModalComponent} from './components/dialog-modal/dialog-modal.component';
import {UrebalCytoscapeComponent} from './components/urebal-cytoscape/urebal-cytoscape.component';
import {RebalanceComponent} from './components/autocomplete/rebalance/rebalance.component';
import {JqxChartModule} from "./jqwidgets/jqx-chart/jqx-chart.module";
import {JqxGridModule} from "./jqwidgets/jqx-grid/jqx-grid.module";
import {JqxDropdownModule} from "./jqwidgets/jqx-dropdown/dropdown-list.module";
import {JqxInputModule} from "./jqwidgets/jqx-input/jqx-input.module";
import {SoftpakGridComponent} from "./jqwidgets/jqx-grid/softpak-grid.component";
import {SoftpakChartComponent} from "./jqwidgets/jqx-chart/softpak-chart.component";
import {ErrorModalComponent} from './components/error-modal/error-modal.component';
import {jqxNotificationComponent} from "@jqxSource/angular_jqxnotification";
import {SoftpakDropdownComponent} from "./jqwidgets/jqx-dropdown/softpak-dropdown.component";
import { UrebalWidgetComponent } from './components/urebal-widget/urebal-widget.component';
import {InputValidationDirective} from "./directives/InputValidation.directive";
import {AccordionLazyLoadedDirective} from "./directives/AccordionLazyLoaded.directive";
import {JqxComboboxModule} from "./jqwidgets/jqx-combobox/jqx-combobox.module";
import {SoftpakComboBoxComponent} from "./jqwidgets/jqx-combobox/softpak-combobox.component";
import {PortfolioSimpleComponent} from "./components/autocomplete/portfolio-simple/portfolio-simple.component";
import { UrebalDropdownButtonComponent } from './components/urebal-dropdown-button/urebal-dropdown-button.component';
import {jqxDateTimeInputComponent} from "@jqxSource/angular_jqxdatetimeinput";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        JqxChartModule,
        JqxDropdownModule,
        JqxGridModule,
        JqxInputModule,
        JqxComboboxModule
    ],
    declarations: [
        jqxTreeGridComponent,
        PercentageDirective,
        InputValidationDirective,
        AccordionLazyLoadedDirective,
        DollarFormatterPipe,
        PercentFormatterPipe,
        ModalComponent,
        ExpandableSettingsComponent,
        AutocompleteComponent,
        ToggleButtonComponent,
        UrebalGridComponent,
        UrebalDropdownComponent,
        UrebalAutocompleteComponent,
        URebalTreeGridComponent,
        URebalAccountTreeGridComponent,
        NumberFormatterDirective,
        NumberBoundedFormatterDirective,
        NumberFormatterPipe,
        MinusSignToParensPipe,
        UpperCaseDirective,
        SecurityComponent,
        AlertsComponent,
        KeysPipe,
        BreadcrumbComponent,
        SecurityAndModelComponent,
        DefaultComponent,
        NextInputDirective,
        ForbiddenAccessComponent,
        UrebalTopBarComponent,
        PortfolioComponent,
        AccountComponent,
        AccountSummaryComponent,
        DriftedAccountComponent,
        NumberOfDaysDirective,
        EquivalenceComponent,
        ModelComponent,
        UrebalSidebarComponent,
        UrebalAccordionGroupComponent,
        UrebalAccordionComponent,
        MessageModalComponent,
        DialogModalComponent,
        ErrorModalComponent,
        UrebalCytoscapeComponent,
        RebalanceComponent,
        ErrorModalComponent,
        jqxNotificationComponent,
        UrebalWidgetComponent,
        PortfolioSimpleComponent,
        PortfolioSimpleComponent,
        jqxDateTimeInputComponent,
        UrebalDropdownButtonComponent
    ],

    exports: [
        RouterModule,
        UrebalWidgetComponent,
        jqxChartComponent,
        jqxTreeGridComponent,
        AutocompleteComponent,
        ToggleButtonComponent,
        ModalComponent,
        ExpandableSettingsComponent,
        UrebalGridComponent,
        URebalTreeGridComponent,
        URebalAccountTreeGridComponent,
        UrebalDropdownComponent,
        UrebalAutocompleteComponent,
        DollarFormatterPipe,
        PercentFormatterPipe,
        PercentageDirective,
        InputValidationDirective,
        AccordionLazyLoadedDirective,
        NumberFormatterDirective,
        NumberBoundedFormatterDirective,
        NumberFormatterPipe,
        MinusSignToParensPipe,
        UpperCaseDirective,
        AlertsComponent,
        KeysPipe,
        BreadcrumbComponent,
        NextInputDirective,
        UrebalTopBarComponent,
        UrebalSidebarComponent,
        AccountSummaryComponent,
        NumberOfDaysDirective,
        UrebalAccordionGroupComponent,
        UrebalAccordionComponent,
        jqxGridComponent,
        MessageModalComponent,
        DialogModalComponent,
        UrebalCytoscapeComponent,
        ErrorModalComponent,
        RebalanceComponent,
        SoftpakGridComponent,
        SoftpakChartComponent,
        jqxNotificationComponent,
        SoftpakChartComponent,
        SoftpakChartComponent,
        SoftpakDropdownComponent,
        SoftpakComboBoxComponent,
        jqxDateTimeInputComponent,
        UrebalDropdownButtonComponent
    ],
    providers: [
        DollarFormatterPipe,
        PercentFormatterPipe,
        NumberFormatterPipe,
        MinusSignToParensPipe,
        Permissions
    ]
})
export class SharedModule {
}
