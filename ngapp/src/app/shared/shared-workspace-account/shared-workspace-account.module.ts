import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EquivalencesCreateComponent} from "../../equivalences/equivalences-create/equivalences-create.component";
import {EquivalencesListComponent} from "../../equivalences/equivalences-list/equivalences-list.component";
import {EquivalencesComponent} from "../../equivalences/components/equivalences/equivalences.component";
import {AccountComponent} from "../../account/account-list/account.component";
import {CreateHouseHoldComponent} from "../../account/create-household/create-household.component";
import {AccountDetailComponent} from "../../account/account-detail/account-detail.component";
import {EquivalenceBuilderComponent} from "../../equivalences/equivalence-builder/equivalence-builder.component";
import {TaxSettingsComponent} from "../../account/components/account-settings/tax-settings/tax-settings.component";
import {DriftComponent} from "../../account/components/account-settings/drift/drift.component";
import {RebalanceSettingsComponent} from "../../account/components/rebalance-settings/rebalance-settings.component";
import {AccountSettingsComponent} from "../../account/components/account-settings/account-settings.component";
import {RestrictionsComponent} from "../../account/components/account-settings/restrictions/restrictions.component";
import {PositionsComponent} from "../../account/components/account-settings/positions/positions.component";
import {WashsalesComponent} from "../../account/components/account-settings/washsales/washsales.component";
import {AttributeRestrictionComponent} from "../../account/components/account-settings/attribute-restriction/attribute-restriction.component";
import {DragulaModule} from "ng2-dragula";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared.module";
import {ModelElementsComponent} from "../../model/components/model-elements/model-elements.component";
import {OverviewModule} from "../../account/components/account-settings/overview/overview.module";
import {AutocompleteSecurityModule} from "../components/autocomplete/autocomplete-security/autocomplete-security.module";
import {JqxComboboxModule} from "../jqwidgets/jqx-combobox/jqx-combobox.module";
import {JqxInputModule} from "../jqwidgets/jqx-input/jqx-input.module";
import {EquivalenceDetailComponent} from "../../equivalences/equivalences-list/equivalence-detail/equivalence-detail.component";
import {AutocompleteAccountModule} from "../components/autocomplete/autocomplete-account/autocomplete-account.module";

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    FormsModule,
    SharedModule,
    OverviewModule,
    AutocompleteSecurityModule,
    JqxComboboxModule,
    JqxInputModule,
    AutocompleteAccountModule
  ],
    declarations: [
        RebalanceSettingsComponent,
        AccountComponent,
        AccountSettingsComponent,
        RestrictionsComponent,
        TaxSettingsComponent,
        WashsalesComponent,
        PositionsComponent,
        AttributeRestrictionComponent,
        AccountDetailComponent,
        CreateHouseHoldComponent,
        DriftComponent,
        EquivalencesComponent,
        EquivalencesListComponent,
        EquivalencesCreateComponent,
        EquivalenceBuilderComponent,
        EquivalenceDetailComponent,
        ModelElementsComponent
    ],
    exports: [
        RebalanceSettingsComponent,
        AccountComponent,
        AccountSettingsComponent,
        RestrictionsComponent,
        TaxSettingsComponent,
        WashsalesComponent,
        PositionsComponent,
        AttributeRestrictionComponent,
        AccountDetailComponent,
        CreateHouseHoldComponent,
        DriftComponent,
        EquivalencesListComponent,
        EquivalenceDetailComponent,
        EquivalencesCreateComponent,
        EquivalenceBuilderComponent,
        ModelElementsComponent,
        JqxComboboxModule
    ]
})
export class SharedWorkspaceAccountModule {
}
