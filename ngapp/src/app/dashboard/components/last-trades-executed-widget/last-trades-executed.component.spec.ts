import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastTradesExecutedComponent } from './last-trades-executed.component';

xdescribe('LastTradesExecutedComponent', () => {
  let component: LastTradesExecutedComponent;
  let fixture: ComponentFixture<LastTradesExecutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastTradesExecutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastTradesExecutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
