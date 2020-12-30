import { Pipe, PipeTransform, Inject} from '@angular/core';
import {DomSanitizer, SafeStyle, SafeHtml} from '@angular/platform-browser';

import {URebalService} from '../../services/urebal.service';

@Pipe({name: 'percent',pure: true})
export class PercentFormatterPipe implements PipeTransform {
    private safeHtml: SafeHtml;
    constructor(public urebalService: URebalService,public sanitizer: DomSanitizer){}

    transform(value: string, args?: any[]): any {

      if(value != null){
        if(parseFloat(value) < 0 && args != null){
          if(args["html"]){
            this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(`<span style="color: red;">${this.urebalService.convertToPercent(value,args)}</span>`);
            return this.safeHtml;
          }else{
            return this.urebalService.convertToPercent(value,args);
          }
        }

        return this.urebalService.convertToPercent(value,args);
      }
    }
}

@Pipe({name: 'dollar', pure: true})
export class DollarFormatterPipe implements PipeTransform {
  private safeHtml: SafeHtml;
  constructor(public urebalService:URebalService,public sanitizer: DomSanitizer){}

  transform(value: string, args?: string[]): any {
    if(value != null)
      if(parseFloat(value) < 0 && args != null){
        if(args["html"]){
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(`<span style="color: red;">${this.urebalService.convertToDollar(value,args)}</span>`);
          return this.safeHtml;
        }else{
          return this.urebalService.convertToDollar(value,args);
        }
      }
    return this.urebalService.convertToDollar(value,args);
  }
}

@Pipe({ name: "NumberPipe", pure: true })
export class NumberFormatterPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
    var clean = value.replace(/[^-0-9\.]/g, '');
    var negativeCheck = clean.split('-');
    var decimalCheck = clean.split('.');

    if (negativeCheck[1] != undefined) {
      negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
      clean = negativeCheck[0] + '-' + negativeCheck[1];
      if (negativeCheck[0].length > 0) {
        clean = negativeCheck[0];
      }

    }
    if (decimalCheck[1] != undefined) {
      decimalCheck[1] = decimalCheck[1].slice(0, 3);
      clean = decimalCheck[0] + '.' + decimalCheck[1];
    }

    return clean;
  }

  parse(value: string, fractionSize: number = 3): string {

    var clean = value.replace(/[^-0-9\.]/g, '');
    var negativeCheck = clean.split('-');
    var decimalCheck = clean.split('.');

    if (negativeCheck[1] != undefined) {
      negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
      clean = negativeCheck[0] + '-' + negativeCheck[1];
      if (negativeCheck[0].length > 0) {
        clean = negativeCheck[0];
      }
    }
    if (decimalCheck[1] != undefined) {
      decimalCheck[1] = decimalCheck[1].slice(0, 3);
      clean = decimalCheck[0] + '.' + decimalCheck[1];
    }

    return clean;
  }
}
