import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionnallistComponent } from './functionnallist.component';

describe('FunctionnallistComponent', () => {
  let component: FunctionnallistComponent;
  let fixture: ComponentFixture<FunctionnallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionnallistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionnallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
