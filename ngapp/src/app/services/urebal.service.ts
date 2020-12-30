import {Injectable} from '@angular/core';
import {ResponseContentType} from '../shared/classes/ResponseContentType.class';
import {Observable, Subject, throwError} from "rxjs";
import {AppConfig} from '../../app.config';
import {catchError, map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http";

import {CustomResponse} from "../shared/classes/CustomResponse.class";
import {IRequestOptions} from "../shared/classes/IRequestOptions.class";
import {LocalStorageService} from "angular-2-local-storage";
import {AuthService} from "./auth.service";

declare var EventSource;

@Injectable()
export class URebalService extends AuthService {
    private readonly serviceUrl: string;
    private readonly applicationVersion: string;
    private format: any;

    private notifyAppComponent = new Subject<any>();

    /**
     * Observable string streams
     */
    notifyObservableAppComponent$ = this.notifyAppComponent.asObservable();

    constructor(protected http: HttpClient, protected localStorage: LocalStorageService) {
        super(http, localStorage);

        // Assign header only once for static variable. Note: We assign Authorization token to this static variable.
        if (!AuthService.headers.has("Content-Type")) {
            // header is inherited from AuthService. Because it is required for AuthService for usage in interceptor.
            AuthService.headers = AuthService.headers.set("Content-Type", "application/json");
            AuthService.headers = AuthService.headers.set("Cache-Control", "no-cache");

            // fileHeader is inherited from AuthService. Because it is required for AuthService for usage in interceptor.
            AuthService.fileHeaders = AuthService.fileHeaders.set("Content-Type", "application/json");
            AuthService.fileHeaders = AuthService.fileHeaders.set("Accept", "text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream");
        }

        this.serviceUrl = AppConfig.SERVICES_URL;
        this.applicationVersion = AppConfig.APPLICATION_VERSION;

        this._setToken();
    }

    public loadJQXDataFormat() {
        // called when JQX is lazy loaded after login
        if (!this.format) {
            this.format = jqx.dataFormat;
        }
    }

    public notifyAppComponentCall(data: any) {
        if (data) {
            this.notifyAppComponent.next(data);
        }
    }

    public config(key: string): string {
        let screens = {
            "manageTradesLink": "none",
            "hideNavigation": "none",
            "add_other_screen": "block_none"
        };

        return screens[key];
    }

    public convertToPercent(value, args?: any[], decimalPlaces?): string {
        this.loadJQXDataFormat();
        let format = true;
        let symbol = false;
        let is_shares = false;

        if (args != undefined) {
            if (args['format'] != undefined) {
                format = args['format'];
            }

            if (args['symbol'] != undefined) {
                symbol = args['symbol'];
            }

            if (args['shares'] != undefined) {
                is_shares = args['shares'];
            }
        }

        if (format) {

            if (is_shares) {
                return this.format.formatnumber(value, 'd0') || value;
            }

            if (symbol)
                if (decimalPlaces != undefined) {
                    return this.format.formatnumber(value, 'd' + decimalPlaces) + '%' || value;
                } else {
                    return this.format.formatnumber(value, 'd3') + '%' || value;
                }
            else if (decimalPlaces != undefined) {
                return this.format.formatnumber(value, 'd' + decimalPlaces) || value;
            } else {
                return this.format.formatnumber(value, 'd3') || value;
            }
        } else {
            if (decimalPlaces != undefined) {
                return parseFloat(value).toFixed(decimalPlaces);
            } else {
                return parseFloat(value).toFixed(3);
            }
        }
    }

    public convertToDollar(value, args?: any[]): string {
        this.loadJQXDataFormat();
        let format = true;

        if (args != undefined) {
            if (args['format'] != undefined) {
                format = args['format'];
            }
        }

        if (format) {
            if (parseFloat(value) < 0) {
                let val = Math.abs(parseFloat(value));
                return '$(' + this.format.formatnumber(val, 'd2') + ')';
            }

            return '$' + this.format.formatnumber(value, 'd2') || value;
        } else {
            return parseFloat(value).toFixed(2);
        }
    }

    public getAppContext(): string {
        let path = "";
        if (AppConfig.CONTEXT_PATH) {
            path = "/" + AppConfig.CONTEXT_PATH;
        }
        return path;
    }

    public validateSession(): Observable<CustomResponse> {
        return this.get('user/validateSession?q=' + (new Date()).toUTCString());
    }

    // Note: This get method doesn't link authorization token or cookie with request.
    // Purpose: Send request to server without authorization information.
    public getUnauthorized(url, options: IRequestOptions = {}): Observable<CustomResponse> {
        options.withCredentials = false;

        return this.http.get(this.serviceUrl + url, options)
            .pipe(
                map(this.extractData),
            );
    }

    public get(url, body?): Observable<CustomResponse> {
        const options = {} as IRequestOptions;
        options.headers = AuthService.headers;
        options.withCredentials = true;
        options.body = body;

        return this.http.get(this.serviceUrl + url, options)
            .pipe(
                map(this.extractData)
            );
    }

    public getJSON(filename): Observable<CustomResponse> {

        let url = window.location.origin + this.getAppContext() + '/assets/json/' + filename;

        const options = {} as IRequestOptions;
        options.headers = AuthService.headers;
        options.withCredentials = true;
        //options.body = body;

        return this.http.get(url, options)
            .pipe(
                map(this.extractData),
                catchError((error: HttpErrorResponse) => {
                    if (error.status == 200) {
                        console.error(`Invalid JSON found in ${filename}`);
                    }
                    return []
                })
                //catchError(this.handleError)
            );
    }

    public postFormData(url, params): Observable<CustomResponse> {
        return this.postForm(url, params);
    }

    public downloadFile(url, type: ResponseContentType) {
        let options = {} as IRequestOptions;
        options.headers = URebalService.fileHeaders;
        options.withCredentials = true;
        options.observe = "response" as "body";
        options.responseType = ResponseContentType.Blob as "json";

        let contentExtractor = this.extractFileContent;

        if (type == ResponseContentType.Blob)
            contentExtractor = this.extractBlobContent;

        return this.http.get(this.serviceUrl + url, options)
            .pipe(
                map(contentExtractor),
                //catchError(this.handleError)
            )
    }

    public postForm(url, params): Observable<CustomResponse> {
        let options = {} as IRequestOptions;
        options.withCredentials = true;
        options.headers = AuthService.headers;
        // Deleting Content Type so that it set to default which is "multipart/form-data"
        options.headers = options.headers.delete('Content-Type');

        return this.http.post(this.serviceUrl + url, params, options)
            .pipe(
                map(this.extractData),
                //catchError(this.handleError)
            );
    }

    public post(url, params): Observable<CustomResponse> {
        let options = {} as IRequestOptions;
        options.withCredentials = true;
        options.headers = AuthService.headers;

        return this.http.post(this.serviceUrl + url, params, options)
            .pipe(
                map(this.extractData)
            );
    }

    public put(url, params): Observable<CustomResponse> {
        let options = {} as IRequestOptions;
        options.withCredentials = true;
        options.headers = AuthService.headers;
        return this.http.put(this.serviceUrl + url, params, options)
            .pipe(
                map(this.extractData),
                //catchError(this.handleError)
            );
    }

    public delete(url): Observable<CustomResponse> {
        let options = {} as IRequestOptions;
        options.withCredentials = true;
        options.headers = AuthService.headers;
        return this.http.delete(this.serviceUrl + url, options)
            .pipe(
                map(this.extractData),
                //catchError(this.handleError)
            );
    }

    public sseEvent(sseUrl: string): Observable<string> {
        return new Observable<string>(obs => {
            const es = new EventSource(this.serviceUrl + sseUrl, {withCredentials: true});
            es.addEventListener('message-to-client', (evt) => {
                obs.next(evt.data);
            });
            return () => es.close();
        });
    }

    private extractData(res: CustomResponse) {
        /*let body:CustomResponse = res.json();*/
        let body = res;
        return body || {code: -100, message: 'Malformed Response from Server', responsedata: []};
    }

    private extractFileContent(res: HttpResponse<any>) {
        let content = res.body; //res.text();

        var binaryData = [];
        binaryData.push(content);

        let filename = res.headers.get('content-disposition').split(';')[1].trim().split('=')[1].trim();


        window['saveAs'](new Blob(binaryData, {type: "text/plain"}), filename.replace(/"/g, ''));
    }

    private extractBlobContent(res: HttpResponse<Blob>) {

        //let blob: Blob =  res.blob();
        let blob = res.body;
        let filename = res.headers.get('content-disposition').split(';')[1].trim().split('=')[1].trim();


        window['saveAs'](blob, filename.replace(/"/g, ''));
    }

    // escape : as \: and ' as '' to allow csv parsing: RFC4180
    protected escapeFilterField(field: string): string {
        return encodeURIComponent("'" + field.replace(':', '\\:').replace('\'', '\'\'') + "'");
    }

    //AF20191211: encoding without enclosing the value in single quotes
    protected escapeFilterFieldWithoutSingleQuotes(field: string): string {
        return encodeURIComponent(field.replace('\'', '\'\''));
    }

    public getApplicationVersion(): string {
        return this.applicationVersion;
    }

    public getServiceUrl() {
        return this.serviceUrl;
    }

    getOIDCSignInURL(clientName) {
        return this.getServiceUrl() + `user/oauth/${clientName.toLowerCase()}`
    }

    public oidcLoginRedirect() {
        window.location.href = this.getOIDCSignInURL(this.getClientName());
    }
}