export class GridLinkInfo
{
  private _linkType: string;
  private _linkParams: { [id:string] : any; } = { };

  get linkType() : string {
    return this._linkType;
  }

  set linkType( data:string ) {
    this._linkType = data;
  }

  get linkParams() : {[id:string]:any} {
    return this._linkParams;
  }

  set linkParams( params : {[id:string]:any} ) {

    this._linkParams = params;
  }
}
