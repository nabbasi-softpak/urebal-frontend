import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { URebalUtil } from '../../shared/util/URebalUtil';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-edit-workspace',
  templateUrl: './edit-workspace.component.html',
  styles: []
})
export class EditWorkspaceComponent implements OnInit {
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();
  private publish: BehaviorSubject<any> = new BehaviorSubject(Object);
  /**TODO: will be removed when actual screen will be implementing */
  public paramValue : string = 'waiting for parameter value';
  public arrayTest : any = ["one","two"];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {    
    /**TOD: will be removed when actual screen will be implementing */
    setTimeout(()=>{
      this.route.queryParams.subscribe(params =>{
        console.log(params['testQueryParam']);        
      });

      this.route.params.subscribe(params => {
        this.paramValue = URebalUtil.decodeparams(params['workflow_name']);

        this.arrayTest = [1,2,3,4,5,6];

        this.emitter.emit(this.paramValue);
        this.publish.next(this.arrayTest);
      });     
    },3000);
  }

}
