import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteWorkspaceComponent } from './execute-workspace.component';

xdescribe('ExecuteWorkspaceComponent', () => {
  let component: ExecuteWorkspaceComponent;
  let fixture: ComponentFixture<ExecuteWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecuteWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
