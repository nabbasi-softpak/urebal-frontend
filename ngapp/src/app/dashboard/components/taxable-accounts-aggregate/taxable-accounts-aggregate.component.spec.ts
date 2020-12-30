import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableAccountsAggregateComponent } from './taxable-accounts-aggregate.component';

xdescribe('TaxableAccountsAggregateComponent', () => {
  let component: TaxableAccountsAggregateComponent;
  let fixture: ComponentFixture<TaxableAccountsAggregateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxableAccountsAggregateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableAccountsAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
