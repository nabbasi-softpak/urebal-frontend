import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalAutocompleteComponent } from './urebal-autocomplete.component';

xdescribe('UrebalAutocompleteComponent', () => {
  let component: UrebalAutocompleteComponent;
  let fixture: ComponentFixture<UrebalAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
