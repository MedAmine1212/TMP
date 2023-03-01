import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccontainerComponent } from './fccontainer.component';

describe('FccontainerComponent', () => {
  let component: FccontainerComponent;
  let fixture: ComponentFixture<FccontainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FccontainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FccontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
