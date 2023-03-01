import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFunctionReqModalComponent } from './add-function-req-modal.component';

describe('AddFunctionReqModalComponent', () => {
  let component: AddFunctionReqModalComponent;
  let fixture: ComponentFixture<AddFunctionReqModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFunctionReqModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFunctionReqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
