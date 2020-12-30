import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableCriteriaComponent } from './taxable-criteria.component';

xdescribe('TaxableCriteriaComponent', () => {
  let component: TaxableCriteriaComponent;
  let fixture: ComponentFixture<TaxableCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxableCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
