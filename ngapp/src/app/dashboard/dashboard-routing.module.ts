/**
 * Created by moazzam.qaisar on 4/20/2018.
 */
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    data: {preload: true, delay: true, checkAuth: true}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashBoardRoutingModule { }
