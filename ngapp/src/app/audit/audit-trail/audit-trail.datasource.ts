import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {auditTrailGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";

import {AuditTrailComponent} from "./audit-trail.component";
import GridColumn = jqwidgets.GridColumn;

export const auditTrailGridDataSource=():any =>{
  return{
    localdata:[],
    datatype:'array',
    datafields:[
      {name:'firmName',type:'string'},
      {name:'userId',type:'string'},
      {name:'entityId',type:'string'},
      {name:'entityType',type:'string'},
      {name:'action',type:'string'},
      {name:'timeStamp',type:'date'}
    ]
  }
};


