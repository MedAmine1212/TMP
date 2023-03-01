import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadDetailsComponent } from './workload-details.component';

describe('WorkloadDetailsComponent', () => {
  let component: WorkloadDetailsComponent;
  let fixture: ComponentFixture<WorkloadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkloadDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkloadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
