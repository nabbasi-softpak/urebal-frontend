import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalDropdownButtonComponent } from './urebal-dropdown-button.component';

xdescribe('UrebalDropdownButtonComponent', () => {
  let component: UrebalDropdownButtonComponent;
  let fixture: ComponentFixture<UrebalDropdownButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalDropdownButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalDropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown menu', () => {
      // Hide Dropdown
      component.isActive = false;

      component.toggleDropdown();

      expect(component.isActive).toBe(true);

      component.toggleDropdown();

      expect(component.isActive).toBe(false);
  });
});
