// TODO: Refactor or using UrebalIntercepter instead
/*
import {Injectable, Injector} from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { ErrorLogService } from '../error-log.service';

declare var $: any;
import {UILoader} from '../shared/util/UILoader';
import {tap, finalize} from "rxjs/operators";


@Injectable()
export class HttpInterceptor1 extends Http {
  logservice: ErrorLogService;
  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private injector?: Injector) {
    super(backend, defaultOptions);
    this.logservice = injector.get(ErrorLogService);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url,options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, options));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    return options;
  }

  public get router(): Router { //this creates router property on your service.
    return this.injector.get(Router);
  }

  intercept = (observable: Observable<Response>): any => {

    return observable.pipe(
      tap((res: Response) => {
        //console.log('res:', res);
        if(res.url.indexOf('.json') == -1){
          if(res["_body"] != undefined){
            let jsonCode;
            if(res.headers.get('content-type') == null || res.headers.get('content-type') == 'application/json'){
              jsonCode = JSON.parse(res["_body"]).code;
            }else{
              jsonCode = res.status;
            }

            if(jsonCode != undefined && jsonCode == 401){
              //$('#urebal_header').css('display','none');
              //$('.navigation').removeClass('show');
              //this.router.navigate(['/user/login']);
              return EMPTY;
            }else if(jsonCode != undefined && jsonCode == 405){
              //$('#urebal_header').css('display','block');
              //$('.navigation').addClass('show');
              $('#navigation-links').css('visibility','hidden');
              this.router.navigate(['/secure/user/changepassword']);
              return EMPTY;
            }else if((jsonCode != undefined && jsonCode == 403) || res.status === 403){
              /!*$('#urebal_header').css('display','none');
              this.router.navigate(['user/forbiddenaccess']);
              return Observable.empty;*!/
            }
            else if(jsonCode === undefined){
              console.error("Unexpected response format from URL:" + res.url);
            }
          }
        }

      }, (err: any) => {

        this.logservice.log(err);
        //console.error("Caught error: " + err);
        UILoader.blockUI.stop();
      }),
      finalize(() => {})
    );

  }
}

export function HttpInterceptorFactory(backend: XHRBackend, defaultOptions: RequestOptions, injector: Injector) {
  return  new HttpInterceptor1(backend, defaultOptions, injector);
}
*/
