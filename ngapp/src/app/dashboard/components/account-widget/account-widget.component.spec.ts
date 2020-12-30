import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWidgetComponent } from './account-widget.component';

xdescribe('AccountWidgetComponent', () => {
  let component: AccountWidgetComponent;
  let fixture: ComponentFixture<AccountWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
