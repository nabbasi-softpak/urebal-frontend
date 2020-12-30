import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeCostCurveReportComponent } from './trade-cost-curve-report.component';

xdescribe('TradeCostCurveReportComponent', () => {
  let component: TradeCostCurveReportComponent;
  let fixture: ComponentFixture<TradeCostCurveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeCostCurveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeCostCurveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
