import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNameCriteriaComponent } from './acc-name-criteria.component';

xdescribe('AccountNameCriteriaComponent', () => {
  let component: AccountNameCriteriaComponent;
  let fixture: ComponentFixture<AccountNameCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountNameCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNameCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
