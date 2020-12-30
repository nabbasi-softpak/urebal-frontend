import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {DataImportAccountRoutingModule} from './data-import-account-routing.module';
import {DataImportAccountComponent} from './data-import-account/data-import-account.component';
import {LocalStorageModule, LocalStorageService} from 'angular-2-local-storage';
import {UploadFileComponent} from './data-import-account/upload-file/upload-file.component';
import {MapFieldsComponent} from './data-import-account/map-fields/map-fields.component';
import {VerifyDataComponent} from './data-import-account/verify-data/verify-data.component';
import {ReviewFinishComponent} from './data-import-account/review-finish/review-finish.component';
import {DataImportAccountService} from "./data-import-account-service";
import {DataImportService} from "./data-imports/data-import.service";
import {DataImportComponent} from "./data-imports/data-import.component";
import {DataImportSupportComponent} from './data-import-support/data-import-support.component';
import {JqxGridModule} from "../shared/jqwidgets/jqx-grid/jqx-grid.module";
import {DialogModalComponent} from "../shared/components/dialog-modal/dialog-modal.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataImportAccountRoutingModule,
        SharedModule,
        JqxGridModule,
        LocalStorageModule.forRoot({
            prefix: 'urebal-app',
            storageType: "localStorage"
        })
    ],
    declarations: [
        DataImportComponent,
        DataImportAccountComponent,
        UploadFileComponent,
        MapFieldsComponent,
        VerifyDataComponent,
        ReviewFinishComponent,
        DataImportSupportComponent,
    ],
    providers: [
        DataImportService,
        DataImportAccountService,
        LocalStorageService
    ]
})
export class DataImportAccountModule {
}
