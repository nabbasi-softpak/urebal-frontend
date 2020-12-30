/**
 * WARNING! DONT EDIT THIS FILE
 * Edit /assets/config/config.json file instead
 */
import {Injectable} from '@angular/core';

@Injectable()
export class AppConfig {
    public static SERVICES_URL;
    public static OIDC_REFRESH_URL;
    public static TOMS_URL: string = "/toms/trade/execution";
    public static APPLICATION_VERSION: string = "1.0.32";
    public static POLLING_INTERVAL: number = 15000;
    public static CONTEXT_PATH: string = "app";
    public static NOTIFY_ERROR: boolean = true;
    public static ENGINE_MTS_TYPE: string = "$";
    public static OIDC_MODE: boolean = false; // Guard login page from opening when this flag is true
    public static DEFAULT_OIDC_CLIENT_NAME;
    public static OAUTH_SUPPORTED_PROVIDER;
    public static ENABLE_SELECTED_DRIFT_EXECUTION = false;
    public static DATETIME_FORMAT = 'MM/dd/yyyy HH:mm';
    public static ERROR_PAGE_CONTENT: {} = {
        "forbidden":
            {
                "code": 403,
                "heading": "Forbidden/UnAuthorized Access!",
                "description": "Sorry, you are not authorized to view/navigate to the requested URL/Path"
            },
        "notfound":
            {
                "code": 404,
                "heading": "Page Not Found!",
                "description": "Sorry, the page your are looking for does not exist."
            }
    };
}
