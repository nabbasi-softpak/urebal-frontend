import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceSwapDetailsComponent } from './workspace-swap-details.component';

xdescribe('WorkspaceSwapDetailsComponent', () => {
  let component: WorkspaceSwapDetailsComponent;
  let fixture: ComponentFixture<WorkspaceSwapDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceSwapDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceSwapDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
