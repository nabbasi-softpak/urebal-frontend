import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalDropdownComponent } from './urebal-dropdown.component';

xdescribe('UrebalDropdownComponent', () => {
  let component: UrebalDropdownComponent;
  let fixture: ComponentFixture<UrebalDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
