import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteEquivalenceComponent } from './autocomplete-equivalence.component';

xdescribe('AutocompleteEquivalenceComponent', () => {
  let component: AutocompleteEquivalenceComponent;
  let fixture: ComponentFixture<AutocompleteEquivalenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteEquivalenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteEquivalenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
