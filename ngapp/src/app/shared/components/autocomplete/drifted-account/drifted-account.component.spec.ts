import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftedAccountComponent } from './drifted-account.component';

xdescribe('DriftedAccountComponent', () => {
  let component: DriftedAccountComponent;
  let fixture: ComponentFixture<DriftedAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftedAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftedAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
