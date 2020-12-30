import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsAggregateComponent } from './accounts-aggregate.component';

xdescribe('AccountsAggregateComponent', () => {
  let component: AccountsAggregateComponent;
  let fixture: ComponentFixture<AccountsAggregateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsAggregateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
