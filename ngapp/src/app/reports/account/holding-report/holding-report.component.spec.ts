import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { jqxTreeGridComponent} from '../../../../../src/assets/jqwidgets-ts/angular_jqxtreegrid';


import { PercentFormatterPipe } from '../../../shared/pipes/NumericFormatterPipe';
import { URebalService } from '../../../services/urebal.service';
import { WorkspaceService } from '../../../workspaces/workspace.service';
import { AccountService } from '../../../account/account.service';

import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { DefaultComponent } from '../../../shared/components/autocomplete/default/default.component';
import { ModelComponent} from '../../../shared/components/autocomplete/model/model.component';
import { SecurityComponent } from '../../../shared/components/autocomplete/security/security.component';
import { SecurityAndModelComponent } from '../../../shared/components/autocomplete/security-and-model/security-and-model.component';
import { PortfolioComponent} from '../../../shared/components/autocomplete/portfolio/portfolio.component';
import { DriftedAccountComponent } from '../../../shared/components/autocomplete/drifted-account/drifted-account.component';
import { AccountComponent } from '../../../shared/components/autocomplete/account/account.component';
import { EquivalenceComponent } from '../../../shared/components/autocomplete/equivalence/equivalence.component';
import { AccountSummaryComponent } from '../../../shared/components/account-summary/account-summary.component';
import { HoldingReportComponent } from './holding-report.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SharedModule} from "../../../shared/shared.module";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('HoldingReportComponent', () => {
  let component: HoldingReportComponent;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations:
        [
          HoldingReportComponent
        ],
      providers: [URebalService,WorkspaceService,AccountService,PercentFormatterPipe, LocalStorageService],
      imports: [HttpClientModule,FormsModule, HttpClientTestingModule, SharedModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingReportComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Grid should contain expected columns', () => {

    let columns = [];
    let expectedColumns = ['Security ID', 'Security Name', 'Shares', 'No. of Lots', 'Market Value (USD)', 'Tradeable', 'Basis Price (USD)', 'Purchase Date'];
    for (let column = 0; column < component.holdingsReportGrid.columns()['records'].length; column++) {
      columns.push(component.holdingsReportGrid.columns()['records'][column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected columns properties', () => {

    let expectedColumns = [
      {
        'text':'Security ID',
        'datafield':'ticker',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Security Name',
        'datafield':'',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Shares',
        'datafield':'shares',
        "cellsFormat":"d0",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'No. of Lots',
        'datafield':'shareLots',
        "cellsFormat":"d0",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Market Value (USD)',
        'datafield':'marketValue',
        "cellsFormat":"c2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Tradeable',
        'datafield':'isTradeable',
        'align':'center',
        'cellsalign':'center'
      },
      {
        'text':'Basis Price (USD)',
        'datafield':'basisPrice',
        "cellsFormat":"c2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Purchase Date',
        'datafield':'buyDate',
        "cellsFormat":"MMM dd, yyyy",
        'align':'center',
        'cellsalign':'right'
      }
    ];

    for (let column = 0; column < component.holdingsReportGrid.columns()['records'].length; column++) {
      let properties = Object.keys(expectedColumns[column]);
      for (let property = 0; property < properties.length; property++) {
        expect(component.holdingsReportGrid.columns()['records'][column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
      }

    }

  });

  it('Account Summary UI elements should contain given data', () => {

    let accountSummary = {
      "@id":1,
      "portfolioId":3855,
      "portfolioName":"HOUSE01",
      "isClone":false,
      "isHouseHold":true,
      "accounts":
        [
          {
            "@id":2,
            "id":"KA_AUTO_A_EQL1_009",
            "accountName":"KA_AUTO_A_EQL1_009",
            "isTaxable":false,
            "marketValue":3179390,
            "positions":
              [
                {
                  "accountPositionId":
                    {
                      "ticker":"YHOO"
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"AAON",
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"ABCD",
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"CBR"
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"CCU"
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"$CASH"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"BA"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"BAMM"
                    }
                }
              ]
          },
          {
            "@id":3,
            "id":"KA_AUTO_A_EQL1_008",
            "accountName":"KA_AUTO_A_EQL1_008",
            "isTaxable":false,
            "marketValue":3479390,
            "positions":
              [
                {
                  "accountPositionId":
                    {
                      "ticker":"BA"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"CBR"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"CCU"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"BAMM"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"YHOO"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"$CASH"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"AAON"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"ABCD"
                    }
                }
              ]
          },
          {
            "@id":4,"id":"KA_AUTO_A_EQL1_007",
            "accountName":"KA_AUTO_A_EQL1_007",
            "isTaxable":true,
            "marketValue":3179390,
            "positions":
              [
                {
                  "accountPositionId":
                    {
                      "ticker":"$CASH"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"BA"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"CBR"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"CCU"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"BAMM"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"YHOO"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"AAON"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker":"ABCD"
                    }
                }
              ]
          }
        ],
      "drift":0,
      "marketValue":9838170,
      "cashPercentage":3.8784,
      "cash":381563.585280,
      "freeCash":50000,
      "freeCashPercentage":0.5100,
      "positionsCount":8,
      "isTaxable": false
    };

    component.accountSummary.accountDetail = accountSummary;

    fixture.detectChanges();

    expect(htmlElement.querySelector('span[id="account-title"]').innerHTML).toEqual(accountSummary.portfolioName);
    expect(htmlElement.querySelector('span[id="account-id"]').innerHTML).toEqual('N/A');
    expect(htmlElement.querySelector('span[id="account-type"]').innerHTML).toEqual('Household');
    expect(htmlElement.querySelector('span[id="account-mkv"]').innerHTML).toEqual('$'+accountSummary.marketValue.toFixed(0).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
    expect(htmlElement.querySelector('span[id="account-holdings"]').innerHTML).toBeLessThanOrEqual(accountSummary.positionsCount);
    expect(htmlElement.querySelector('span[id="account-freecash"]').innerHTML).toEqual('$'+accountSummary.freeCash.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    expect(htmlElement.querySelector('span[id="account-corecash"]').innerHTML).toEqual('$'+accountSummary.cash.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

  });

});
