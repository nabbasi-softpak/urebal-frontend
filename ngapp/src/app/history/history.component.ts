import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  // Dummy data, will be loaded from service.
  public histories: any = [
    {
      date: "June 1, 2018",
      records: [
        {
          name: "Rebalances and Trades",
          icon: "autorenew",
          btn_name: "View Trades",
          accounts: [
            {
              title: "BEVIS WASHINGTON",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            },
            {
              title: "ADRIAN ANDREWS",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            },
            {
              title: "RAJA CROSS",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            }

          ]
        },
        {
          name: "Models Changes",
          icon: "pie_chart",
          btn_name: "View Models",
          accounts: [
            {
              title: "DIVERSIFIED SECTOR",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "US EQUITIES",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "BALANCED ALLOCATION",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "US LARGE CAP STOCKS",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
          ]
        },
        {
          name: "Settings Changed",
          icon: "settings",
          btn_name: "View Settings",
          accounts: [
            {
              title: "Rebalance Name: THOMPSON FAMILY",
              description: "MTS: 1%, Apply Minimum, Apply Equivalences, Object Function Rebalancing"
            },
            {
              title: "Rebalance Name: CONSERVATIVE ALLOCATION ACCOUNTS",
              description: "MTS: 1%, Apply Minimum, Apply Equivalences, Object Function Rebalancing"
            }
          ]
        }
      ]
    },
    {
      date: "May 20, 2018",
      records: [
        {
          name: "Rebalances and Trades",
          icon: "autorenew",
          btn_name: "View Trades",
          accounts: [
            {
              title: "BEVIS WASHINGTON",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            },
            {
              title: "ADRIAN ANDREWS",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            },
            {
              title: "RAJA CROSS",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            }

          ]
        },
        {
          name: "Models Changes",
          icon: "pie_chart",
          btn_name: "View Models",
          accounts: [
            {
              title: "DIVERSIFIED SECTOR",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "US EQUITIES",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "BALANCED ALLOCATION",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "US LARGE CAP STOCKS",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
          ]
        },
        {
          name: "Settings Changed",
          icon: "settings",
          btn_name: "View Settings",
          accounts: [
            {
              title: "Rebalance Name: THOMPSON FAMILY",
              description: "MTS: 1%, Apply Minimum, Apply Equivalences, Object Function Rebalancing"
            },
            {
              title: "Rebalance Name: CONSERVATIVE ALLOCATION ACCOUNTS",
              description: "MTS: 1%, Apply Minimum, Apply Equivalences, Object Function Rebalancing"
            }
          ]
        }
      ]
    },
    {
      date: "May 10, 2018",
      records: [
        {
          name: "Rebalances and Trades",
          icon: "autorenew",
          btn_name: "View Trades",
          accounts: [
            {
              title: "BEVIS WASHINGTON",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            },
            {
              title: "ADRIAN ANDREWS",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            },
            {
              title: "RAJA CROSS",
              description: "Rebalance Settings: Generate Cash, 1,098 Trades"
            }

          ]
        },
        {
          name: "Models Changes",
          icon: "pie_chart",
          btn_name: "View Models",
          accounts: [
            {
              title: "DIVERSIFIED SECTOR",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "US EQUITIES",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "BALANCED ALLOCATION",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
            {
              title: "US LARGE CAP STOCKS",
              description: "Securities: IBM, APL, MSC, AAAA, AAPC, ALCS"
            },
          ]
        },
        {
          name: "Settings Changed",
          icon: "settings",
          btn_name: "View Settings",
          accounts: [
            {
              title: "Rebalance Name: THOMPSON FAMILY",
              description: "MTS: 1%, Apply Minimum, Apply Equivalences, Object Function Rebalancing"
            },
            {
              title: "Rebalance Name: CONSERVATIVE ALLOCATION ACCOUNTS",
              description: "MTS: 1%, Apply Minimum, Apply Equivalences, Object Function Rebalancing"
            }
          ]
        }
      ]
    }
  ]

  constructor() {}

  ngOnInit() {}

}
