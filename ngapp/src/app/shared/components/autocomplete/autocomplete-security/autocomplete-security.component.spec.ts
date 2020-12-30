import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteSecurityComponent } from './autocomplete-security.component';

xdescribe('AutocompleteSecurityComponent', () => {
  let component: AutocompleteSecurityComponent;
  let fixture: ComponentFixture<AutocompleteSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
