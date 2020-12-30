import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftreportSummaryWidgetComponent } from './driftreport-summary-widget.component';

xdescribe('DriftreportSummaryWidgetComponent', () => {
  let component: DriftreportSummaryWidgetComponent;
  let fixture: ComponentFixture<DriftreportSummaryWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftreportSummaryWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftreportSummaryWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
