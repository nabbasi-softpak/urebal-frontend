import {Injectable, Injector} from '@angular/core';
import {UserService} from "./user/user.service";
import {URebalService} from "./services/urebal.service";
import {LocalStorageService} from "angular-2-local-storage";
import {PermissionResolverService} from "./services/permission-resolver.service";
import {ConfigService} from "./services/config.service";

@Injectable()
export class AppResolverService {
    constructor() {
    }
}

export function AppResolverServiceFactory(configService: ConfigService): Function {

    return () => {
        return new Promise(function(resolve) {
            Promise.all([
                configService.loadConfigJSON(),
                configService.loadGridColumnJSON(),
            ]).then(() => {
                resolve();
            });
        });
    };
}
