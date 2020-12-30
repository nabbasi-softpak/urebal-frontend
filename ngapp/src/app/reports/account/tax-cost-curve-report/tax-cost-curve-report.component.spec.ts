import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCostCurveReportComponent } from './tax-cost-curve-report.component';

xdescribe('TaxCostCurveReportComponent', () => {
  let component: TaxCostCurveReportComponent;
  let fixture: ComponentFixture<TaxCostCurveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCostCurveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCostCurveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
