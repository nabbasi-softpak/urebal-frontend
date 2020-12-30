import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from '../../../shared/shared.module';

import { URebalService } from '../../../services/urebal.service';
import { AccountService } from '../../../account/account.service';

import {UrebalPermissions, PermissionResolverService} from '../../../services/permission-resolver.service';

import { AttributeReportComponent } from './attribute-report.component';
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

xdescribe('AttributeReportComponent', () => {
  let component: AttributeReportComponent;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AttributeReportComponent
      ],
      providers: [
        URebalService,
        AccountService,
        UrebalPermissions,
        PermissionResolverService,
        LocalStorageService
      ],
      imports: [HttpClientModule,FormsModule, SharedModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeReportComponent);
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
    let expectedColumns = ['Attribute Name', 'Type', 'Target %', 'Init %', 'Prop %', 'Min %', 'Max %', 'Change %'];
    for (let column = 0; column < component.attributeReportGrid.getColumns()['records'].length; column++) {
      columns.push(component.attributeReportGrid.getColumns()['records'][column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected columns properties', () => {

    let expectedColumns = [
      {
        'text':'Attribute Name',
        'datafield':'attributeName',
        'align':'center'
      },
      {
        'text':'Type',
        'datafield':'attributeType',
        'align':'center',
        'cellsalign':'center'
      },
      {
        'text':'Target %',
        'datafield':'targetPercent',
        "cellsFormat":"d2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Init %',
        'datafield':'initPercent',
        "cellsFormat":"d2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Prop %',
        'datafield':'proposedPercent',
        "cellsFormat":"d2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Min %',
        'datafield':'minPercent',
        "cellsFormat":"d2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Max %',
        'datafield':'maxPercent',
        "cellsFormat":"d2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Change %',
        'datafield':'changePercent',
        "cellsFormat":"d2",
        'align':'center',
        'cellsalign':'right'
      }
    ];

    for (let column = 0; column < component.attributeReportGrid.getColumns()['records'].length; column++) {
      let properties = Object.keys(expectedColumns[column]);
      for (let property = 0; property < properties.length; property++) {
        expect(component.attributeReportGrid.getColumns()['records'][column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
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
    expect(htmlElement.querySelector('span[id="account-type"]').innerHTML).toEqual('Household');
    expect(htmlElement.querySelector('span[id="account-mkv"]').innerHTML).toEqual('$'+accountSummary.marketValue.toFixed(0).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
    expect(htmlElement.querySelector('span[id="account-holdings"]').innerHTML).toBeLessThanOrEqual(accountSummary.positionsCount);
    expect(htmlElement.querySelector('span[id="account-freecash"]').innerHTML).toEqual('$'+accountSummary.freeCash.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    expect(htmlElement.querySelector('span[id="account-corecash"]').innerHTML).toEqual('$'+accountSummary.cash.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

  });

});
