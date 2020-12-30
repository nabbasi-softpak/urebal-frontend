import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeModelComponent } from './attribute-model.component';

xdescribe('AttributeModelComponent', () => {
  let component: AttributeModelComponent;
  let fixture: ComponentFixture<AttributeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
