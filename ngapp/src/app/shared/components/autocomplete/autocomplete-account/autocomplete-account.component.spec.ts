import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteAccountComponent } from './autocomplete-account.component';

xdescribe('AutocompleteAccountComponent', () => {
  let component: AutocompleteAccountComponent;
  let fixture: ComponentFixture<AutocompleteAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
