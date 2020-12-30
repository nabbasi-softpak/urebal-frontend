import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftDetailsComponent } from './drift-details.component';

xdescribe('DriftDetailComponent', () => {
  let component: DriftDetailsComponent;
  let fixture: ComponentFixture<DriftDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
