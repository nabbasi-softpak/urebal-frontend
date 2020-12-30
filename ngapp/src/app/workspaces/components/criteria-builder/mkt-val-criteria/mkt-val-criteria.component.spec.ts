import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketValueCriteriaComponent } from './mkt-val-criteria.component';

xdescribe('MarketValueCriteriaComponent', () => {
  let component: MarketValueCriteriaComponent;
  let fixture: ComponentFixture<MarketValueCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketValueCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketValueCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
