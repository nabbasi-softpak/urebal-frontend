import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {URebalUtil} from '../../shared/util/URebalUtil';
import {UrebalGridComponent} from '../../shared/components/urebal-grid/urebal-grid.component';
import {GridLinkInfo} from '../../shared/classes/GridLinkInfo.class';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: []
})
export class AccountComponent implements OnInit {
  @ViewChild('accountsList') accountsList: UrebalGridComponent;

  constructor(private route:Router) { }

  ngOnInit() {
    console.log()
  }

  OnLinkActive(event: GridLinkInfo) {
      // Call the relevant method as per data in event object
      if (event.linkType == "openAccountDetail") {
        this.openAccountDetail(event.linkParams["portfolioId"],event.linkParams["portfolioName"],event.linkParams["houseHold"]);
      }
    }

    openAccountDetail(portfolioId, portfolioName,houseHold)
    {
      this.route.navigate(['/secure/accounts/',URebalUtil.encodeparams(portfolioId),URebalUtil.encodeparams(portfolioName),URebalUtil.encodeparams(houseHold)]);
    }

}
