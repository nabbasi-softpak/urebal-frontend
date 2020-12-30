import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftedAccountsAggregateComponent } from './drifted-accounts-aggregate.component';

xdescribe('DriftedAccountsAggregateComponent', () => {
  let component: DriftedAccountsAggregateComponent;
  let fixture: ComponentFixture<DriftedAccountsAggregateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftedAccountsAggregateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftedAccountsAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
