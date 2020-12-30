import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAndModelComponent } from './security-and-model.component';

xdescribe('SecurityAndModelComponent', () => {
  let component: SecurityAndModelComponent;
  let fixture: ComponentFixture<SecurityAndModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityAndModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityAndModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
